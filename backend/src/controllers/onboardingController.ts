import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import {
  validateMotherProfileInput,
  validateBabyProfileInput,
  validateHospitalCodeInput,
  validateCompleteOnboardingInput,
  type BabyProfileInput,
  type MotherProfileInput,
} from '../validators/onboardingValidator.js';
import {
  formatParticipantCode,
  getGroupPrefix,
  extractSequenceFromParticipantCode,
  type StudyGroup,
} from '../utils/participantCode.js';
import { addUtcDays, formatDateOnly } from '../utils/dateOnly.js';
import { randomInt } from 'crypto';
import { recordAudit } from '../services/auditService.js';

function getMotherUserId(req: Request): string {
  if (!req.user) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (req.user.role !== 'mother') {
    throw createError(
      403,
      'MOTHER_ROLE_REQUIRED',
      'Only authenticated mothers can access onboarding profile APIs.'
    );
  }

  return req.user.id;
}

const API_TO_DB_AGE_RANGE: Record<string, string> = {
  below_18: 'below_18',
  '18_25': '18-25',
  '26_30': '26-30',
  '31_35': '31-35',
  '36_40': '36-40',
  above_40: 'above_40',
};

const DB_TO_API_AGE_RANGE: Record<string, string> = {
  below_18: 'below_18',
  '18-25': '18_25',
  '26-30': '26_30',
  '31-35': '31_35',
  '36-40': '36_40',
  above_40: 'above_40',
};

function validationError(message: string, details?: unknown): Error {
  return createError(400, 'INVALID_REQUEST', message, details);
}

function toMotherProfileResponse(profile: {
  id: string;
  userId: string;
  participantCode: string | null;
  studyGroup: string | null;
  hospitalId: string | null;
  fullName: string | null;
  ageRange: string;
  educationMother: string;
  educationFather: string;
  occupationMother: string;
  occupationFather: string;
  incomeClass: string;
  familyType: string;
  familyMembersCount: string;
  religion: string;
  residenceType: string;
  contactNumber: string | null;
  prevPretermEducation: boolean;
  educationSource: string[];
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}): Record<string, unknown> {
  return {
    id: profile.id,
    userId: profile.userId,
    participantCode: profile.participantCode,
    studyGroup: profile.studyGroup,
    hospitalId: profile.hospitalId,
    fullName: profile.fullName,
    ageRange: DB_TO_API_AGE_RANGE[profile.ageRange] ?? profile.ageRange,
    educationMother: profile.educationMother,
    educationFather: profile.educationFather,
    occupationMother: profile.occupationMother,
    occupationFather: profile.occupationFather,
    incomeClass: profile.incomeClass,
    familyType: profile.familyType,
    familyMembersCount: Number(profile.familyMembersCount),
    religion: profile.religion,
    residenceType: profile.residenceType,
    contactNumber: profile.contactNumber,
    prevPretermEducation: profile.prevPretermEducation,
    educationSource: profile.educationSource,
    enrolledAt: profile.enrolledAt.toISOString(),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function toBabyProfileResponse(profile: {
  id: string;
  motherProfileId: string;
  babyName: string | null;
  sex: string;
  dateOfBirth: Date;
  gestationalAgeWeeks: { toString(): string };
  birthWeightGrams: number;
  weightAtDischargeGrams: number;
  placeOfDelivery: string;
  nicuStayDays: number;
  skinToSkinAtBirth: boolean;
  kmcInNicu: boolean;
  feedingAtDischarge: string;
  criedAtBirth: boolean;
  neededResuscitation: boolean;
  birthWeightStratum: string;
  dischargeDate: Date;
  createdAt: Date;
  updatedAt: Date;
}): Record<string, unknown> {
  return {
    id: profile.id,
    motherProfileId: profile.motherProfileId,
    babyName: profile.babyName,
    sex: profile.sex,
    dateOfBirth: profile.dateOfBirth.toISOString().slice(0, 10),
    gestationalAgeWeeks: Number(profile.gestationalAgeWeeks.toString()),
    birthWeightGrams: profile.birthWeightGrams,
    weightAtDischargeGrams: profile.weightAtDischargeGrams,
    placeOfDelivery: profile.placeOfDelivery,
    nicuStayDays: profile.nicuStayDays,
    skinToSkinAtBirth: profile.skinToSkinAtBirth,
    kmcInNicu: profile.kmcInNicu,
    feedingAtDischarge: profile.feedingAtDischarge,
    criedAtBirth: profile.criedAtBirth,
    neededResuscitation: profile.neededResuscitation,
    birthWeightStratum: profile.birthWeightStratum,
    dischargeDate: profile.dischargeDate.toISOString().slice(0, 10),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function motherProfileData(input: MotherProfileInput) {
  return {
    fullName: input.fullName ?? null,
    ageRange: API_TO_DB_AGE_RANGE[input.ageRange] ?? input.ageRange,
    educationMother: input.educationMother,
    educationFather: input.educationFather,
    occupationMother: input.occupationMother,
    occupationFather: input.occupationFather,
    incomeClass: input.incomeClass,
    familyType: input.familyType,
    familyMembersCount: input.familyMembersCount,
    religion: input.religion,
    residenceType: input.residenceType,
    contactNumber: input.contactNumber ?? null,
    prevPretermEducation: input.prevPretermEducation,
    educationSource: input.educationSource,
  };
}

function babyProfileData(input: BabyProfileInput) {
  return {
    babyName: input.babyName ?? null,
    sex: input.sex,
    dateOfBirth: input.dateOfBirth,
    gestationalAgeWeeks: input.gestationalAgeWeeks,
    birthWeightGrams: input.birthWeightGrams,
    weightAtDischargeGrams: input.weightAtDischargeGrams,
    placeOfDelivery: input.placeOfDelivery,
    nicuStayDays: input.nicuStayDays,
    skinToSkinAtBirth: input.skinToSkinAtBirth,
    kmcInNicu: input.kmcInNicu,
    feedingAtDischarge: input.feedingAtDischarge,
    criedAtBirth: input.criedAtBirth,
    neededResuscitation: input.neededResuscitation,
    birthWeightStratum: input.birthWeightStratum,
    dischargeDate: input.dischargeDate,
  };
}

export async function saveMotherProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = getMotherUserId(req);
    const validation = validateMotherProfileInput(req.body);

    if (!validation.valid || !validation.data) {
      next(
        validationError(
          'Some profile fields are invalid.',
          validation.errors
        )
      );
      return;
    }

    const data = motherProfileData(validation.data);

    const motherProfile = await prisma.motherProfile.upsert({
      where: { userId },
      create: {
        userId,
        participantCode: null,
        studyGroup: null,
        hospitalId: null,
        ...data,
      },
      update: data,
    });

    res.status(200).json({
      success: true,
      message: 'Mother profile saved successfully.',
      data: {
        motherProfile: toMotherProfileResponse(motherProfile),
        nextStep: 'baby_profile',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function saveBabyProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = getMotherUserId(req);
    const validation = validateBabyProfileInput(req.body);

    if (!validation.valid || !validation.data) {
      next(
        validationError(
          'Some profile fields are invalid.',
          validation.errors
        )
      );
      return;
    }

    const motherProfile = await prisma.motherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!motherProfile) {
      next(
        createError(
          409,
          'MOTHER_PROFILE_REQUIRED',
          'Complete the mother profile before adding the baby profile.'
        )
      );
      return;
    }

    const data = babyProfileData(validation.data);

    const babyProfile = await prisma.babyProfile.upsert({
      where: { motherProfileId: motherProfile.id },
      create: {
        motherProfileId: motherProfile.id,
        ...data,
      },
      update: data,
    });

    res.status(200).json({
      success: true,
      message: 'Baby profile saved successfully.',
      data: {
        babyProfile: toBabyProfileResponse(babyProfile),
        nextStep: 'hospital_code',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function linkHospital(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = getMotherUserId(req);
    const validation = validateHospitalCodeInput(req.body);

    if (!validation.valid || !validation.data) {
      next(validationError('The request contains invalid fields.', validation.errors));
      return;
    }

    const { code } = validation.data;

    // 1. Fetch MotherProfile to verify existence
    const motherProfile = await prisma.motherProfile.findUnique({
      where: { userId },
    });

    if (!motherProfile) {
      next(
        createError(
          409,
          'MOTHER_PROFILE_REQUIRED',
          'Complete the mother profile before linking a hospital.'
        )
      );
      return;
    }

    // 2. Lookup hospital by unique code
    const hospital = await prisma.hospital.findUnique({
      where: { code },
    });

    if (!hospital) {
      next(createError(404, 'HOSPITAL_CODE_INVALID', 'The hospital code is invalid.'));
      return;
    }

    // 3. Reject inactive hospitals
    if (!hospital.isActive) {
      next(createError(409, 'HOSPITAL_ENROLLMENT_CLOSED', 'Enrolment at this hospital is currently closed.'));
      return;
    }

    // 4. Check if already linked
    const alreadyLinked =
      motherProfile.hospitalId === hospital.id && req.user?.hospitalId === hospital.id;

    if (alreadyLinked) {
      res.status(200).json({
        success: true,
        message: 'Hospital is already linked.',
        data: {
          id: hospital.id,
          name: hospital.name,
          code: hospital.code,
          district: hospital.district,
          state: hospital.state,
          type: hospital.type,
          emergencyPhone: hospital.emergencyPhone,
        },
        alreadyLinked: true,
        nextStep: 'participant_code',
      });
      return;
    }

    // 5. Check if hospital can be changed (only if participantCode is still null)
    if (motherProfile.participantCode !== null) {
      next(
        createError(
          409,
          'HOSPITAL_LINK_LOCKED',
          'The hospital cannot be changed after the participant code has been generated.'
        )
      );
      return;
    }

    // 6. Link User and MotherProfile atomically
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { hospitalId: hospital.id },
      });

      await tx.motherProfile.update({
        where: { id: motherProfile.id },
        data: { hospitalId: hospital.id },
      });
    });

    res.status(200).json({
      success: true,
      message: 'Hospital linked successfully.',
      data: {
        id: hospital.id,
        name: hospital.name,
        code: hospital.code,
        district: hospital.district,
        state: hospital.state,
        type: hospital.type,
        emergencyPhone: hospital.emergencyPhone,
      },
      alreadyLinked: false,
      nextStep: 'participant_code',
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrCreateParticipantCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = getMotherUserId(req);

    // Enforce 3 retries for transaction / unique constraint conflicts
    const retries = 3;
    let result;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        result = await prisma.$transaction(async (tx) => {
          // 1. Fetch MotherProfile (with baby and hospital linked)
          const motherProfile = await tx.motherProfile.findUnique({
            where: { userId },
            include: {
              babyProfile: true,
              hospital: true,
            },
          });

          if (!motherProfile) {
            throw createError(
              409,
              'MOTHER_PROFILE_REQUIRED',
              'Complete the mother profile before generating the participant code.'
            );
          }

          // 2. Fetch User to confirm hospital link matches
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { hospitalId: true },
          });

          // 3. Return existing code immediately
          if (motherProfile.participantCode !== null) {
            return {
              participantCode: motherProfile.participantCode,
              studyGroup: motherProfile.studyGroup as StudyGroup,
              alreadyAssigned: true,
              hospital: motherProfile.hospital,
              birthWeightStratum: motherProfile.babyProfile?.birthWeightStratum,
              assignmentSource: 'researcher', // Default source for existing
            };
          }

          // 4. Verify baby profile exists
          if (!motherProfile.babyProfile) {
            throw createError(
              409,
              'BABY_PROFILE_REQUIRED',
              'Complete the baby profile before generating the participant code.'
            );
          }

          // 5. Verify hospital link
          if (!motherProfile.hospitalId || !user?.hospitalId) {
            throw createError(
              409,
              'HOSPITAL_LINK_REQUIRED',
              'Link a hospital before generating the participant code.'
            );
          }

          if (motherProfile.hospitalId !== user.hospitalId) {
            throw createError(
              409,
              'HOSPITAL_LINK_MISMATCH',
              'User and profile hospital links do not match.'
            );
          }

          // 6. Verify hospital is active
          const hospital = motherProfile.hospital;
          if (!hospital) {
            throw createError(
              404,
              'HOSPITAL_NOT_FOUND',
              'Linked hospital not found.'
            );
          }

          if (!hospital.isActive) {
            throw createError(
              409,
              'HOSPITAL_ENROLLMENT_CLOSED',
              'Enrolment at this hospital is currently closed.'
            );
          }

          // 7. Resolve study group
          let studyGroup = motherProfile.studyGroup;
          let assignmentSource = 'researcher';

          if (studyGroup === null) {
            // Check development fallback
            if (
              process.env['NODE_ENV'] !== 'production' &&
              process.env['ENABLE_DEV_RANDOM_GROUP_ASSIGNMENT'] === 'true'
            ) {
              const randomVal = randomInt(2); // 0 or 1
              studyGroup = randomVal === 0 ? 'study' : 'control';
              assignmentSource = 'development_random';

              console.warn(
                `[DevWarning] Assigning studyGroup randomly for user ${userId} in development.`
              );

              // Update studyGroup immediately within the transaction
              await tx.motherProfile.update({
                where: { id: motherProfile.id },
                data: { studyGroup },
              });
            } else {
              throw createError(
                409,
                'STUDY_GROUP_REQUIRED',
                'The study group must be assigned by the researcher before generating a participant code.'
              );
            }
          }

          // 8. Increment the hospital sequence number atomically
          const updatedHospital = await tx.hospital.update({
            where: { id: hospital.id },
            data: {
              nextParticipantNumber: {
                increment: 1,
              },
            },
            select: {
              code: true,
              nextParticipantNumber: true,
            },
          });

          // The number we just reserved is nextParticipantNumber - 1
          const sequence = updatedHospital.nextParticipantNumber - 1;

          // 9. Format participant code
          const participantCode = formatParticipantCode(
            updatedHospital.code,
            studyGroup as StudyGroup,
            sequence
          );

          // 10. Update mother profile only if participantCode is still null (conditional update)
          const updateResult = await tx.motherProfile.updateMany({
            where: {
              id: motherProfile.id,
              participantCode: null,
            },
            data: {
              participantCode,
            },
          });

          if (updateResult.count === 0) {
            throw createError(
              409,
              'PARTICIPANT_CODE_CONFLICT',
              'Participant code already assigned.'
            );
          }

          return {
            participantCode,
            studyGroup: studyGroup as StudyGroup,
            alreadyAssigned: false,
            hospital,
            birthWeightStratum: motherProfile.babyProfile.birthWeightStratum,
            assignmentSource,
          };
        });
        break; // Success, exit retry loop
      } catch (err) {
        // If it's a conflict error and we have retries remaining, sleep and retry
        const isConflict =
          err instanceof Error &&
          ((err as { code?: string }).code === 'P2025' || (err as { code?: string }).code === 'P2002');

        if (isConflict && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          continue;
        }
        throw err;
      }
    }

    if (!result) {
      throw createError(
        409,
        'PARTICIPANT_CODE_CONFLICT',
        'Could not generate participant code due to concurrent updates.'
      );
    }

    const groupPrefix = getGroupPrefix(result.studyGroup);
    const parts = result.participantCode.split('-');
    const sequenceNumber = Number(parts[2]);

    res.status(200).json({
      success: true,
      message: result.alreadyAssigned
        ? 'Participant code already assigned.'
        : 'Participant code generated successfully.',
      data: {
        participantCode: result.participantCode,
        studyGroup: result.studyGroup,
        groupPrefix,
        sequenceNumber,
        birthWeightStratum: result.birthWeightStratum,
        hospital: {
          id: result.hospital?.id,
          code: result.hospital?.code,
          name: result.hospital?.name,
        },
        alreadyAssigned: result.alreadyAssigned,
        assignmentSource: result.assignmentSource,
        nextStep: 'complete_onboarding',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function completeOnboarding(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = getMotherUserId(req);

    // 1. Validate request body (reject any unknown keys)
    const validation = validateCompleteOnboardingInput(req.body);
    if (!validation.valid) {
      next(validationError('The request contains invalid fields.', validation.errors));
      return;
    }

    const retries = 3;
    let result;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        result = await prisma.$transaction(async (tx) => {
          // 2. Fetch MotherProfile and all required relations
          const motherProfile = await tx.motherProfile.findUnique({
            where: { userId },
            include: {
              user: true,
              babyProfile: true,
              hospital: true,
              followUpSchedules: true,
            },
          });

          if (!motherProfile) {
            throw createError(
              409,
              'MOTHER_PROFILE_REQUIRED',
              'Complete the mother profile before finalizing.'
            );
          }

          // 3. Check if onboarding is already completed
          const isAlreadyCompleted = motherProfile.onboardingCompletedAt !== null;

          if (isAlreadyCompleted) {
            // Repair any missing schedules if needed
            const dischargeDate = motherProfile.babyProfile?.dischargeDate;
            let repairedMissingSchedules = false;
            const schedulesToCreate = [];

            if (dischargeDate) {
              const configs = [
                { timePoint: 'baseline', days: 0 },
                { timePoint: '1_month', days: 30 },
                { timePoint: '3_months', days: 90 },
                { timePoint: '6_months', days: 180 },
              ];

              for (const config of configs) {
                const exists = motherProfile.followUpSchedules.some(
                  (s) => s.timePoint === config.timePoint
                );
                if (!exists) {
                  const scheduledDate = addUtcDays(dischargeDate, config.days);
                  schedulesToCreate.push({
                    motherProfileId: motherProfile.id,
                    timePoint: config.timePoint,
                    scheduledDate,
                    status: 'pending',
                    dataComplete: false,
                    actualDate: null,
                    collectedByUserId: null,
                    notes: null,
                  });
                  repairedMissingSchedules = true;
                }
              }

              if (schedulesToCreate.length > 0) {
                await tx.followUpSchedule.createMany({
                  data: schedulesToCreate,
                });
                console.warn(
                  `[Warning] Repaired ${schedulesToCreate.length} missing schedules for completed participant ${motherProfile.participantCode || motherProfile.id}`
                );
              }
            }

            const finalSchedules = await tx.followUpSchedule.findMany({
              where: { motherProfileId: motherProfile.id },
            });

            const timePointOrder: Record<string, number> = {
              baseline: 1,
              '1_month': 2,
              '3_months': 3,
              '6_months': 4,
            };
            finalSchedules.sort(
              (a, b) => (timePointOrder[a.timePoint] ?? 99) - (timePointOrder[b.timePoint] ?? 99)
            );

            return {
              completedAt: motherProfile.onboardingCompletedAt!,
              alreadyCompleted: true,
              repairedMissingSchedules,
              participantCode: motherProfile.participantCode,
              studyGroup: motherProfile.studyGroup,
              hospital: motherProfile.hospital,
              followUpSchedules: finalSchedules,
            };
          }

          // 4. Run prerequisite checks
          interface ValidationErrorDetail {
            section: 'user' | 'motherProfile' | 'babyProfile' | 'hospital' | 'participant';
            field: string;
            message: string;
          }
          const details: ValidationErrorDetail[] = [];

          // 4.1 User checks
          if (!motherProfile.user) {
            details.push({ section: 'user', field: 'id', message: 'User account is missing.' });
          } else {
            if (!motherProfile.user.isActive) {
              details.push({ section: 'user', field: 'isActive', message: 'User account is inactive.' });
            }
            if (motherProfile.user.deletedAt !== null) {
              details.push({ section: 'user', field: 'deletedAt', message: 'User account is deleted.' });
            }
            if (!motherProfile.user.hospitalId) {
              details.push({ section: 'hospital', field: 'hospitalId', message: 'User has no hospital linked.' });
            }
          }

          // 4.2 Mother Profile checks
          const requiredMotherFields = [
            'ageRange',
            'educationMother',
            'educationFather',
            'occupationMother',
            'occupationFather',
            'incomeClass',
            'familyType',
            'familyMembersCount',
            'religion',
            'residenceType',
          ];
          for (const field of requiredMotherFields) {
            const val = (motherProfile as unknown as Record<string, unknown>)[field];
            if (val === null || val === undefined || val === '') {
              details.push({ section: 'motherProfile', field, message: 'Field is required.' });
            }
          }

          if (motherProfile.prevPretermEducation === true) {
            if (!motherProfile.educationSource || motherProfile.educationSource.length === 0) {
              details.push({
                section: 'motherProfile',
                field: 'educationSource',
                message: 'At least one education source is required.',
              });
            }
          }

          if (!motherProfile.hospitalId) {
            details.push({ section: 'hospital', field: 'hospitalId', message: 'Mother profile has no hospital linked.' });
          }
          if (!motherProfile.studyGroup) {
            details.push({ section: 'participant', field: 'studyGroup', message: 'Study group is required.' });
          }
          if (!motherProfile.participantCode) {
            details.push({ section: 'participant', field: 'participantCode', message: 'Participant code is required.' });
          }

          // 4.3 Baby Profile checks
          if (!motherProfile.babyProfile) {
            details.push({ section: 'babyProfile', field: 'id', message: 'Baby profile is missing.' });
          } else {
            const requiredBabyFields = [
              'sex',
              'dateOfBirth',
              'gestationalAgeWeeks',
              'birthWeightGrams',
              'weightAtDischargeGrams',
              'placeOfDelivery',
              'nicuStayDays',
              'skinToSkinAtBirth',
              'kmcInNicu',
              'feedingAtDischarge',
              'criedAtBirth',
              'neededResuscitation',
              'birthWeightStratum',
              'dischargeDate',
            ];
            for (const field of requiredBabyFields) {
              const val = (motherProfile.babyProfile as unknown as Record<string, unknown>)[field];
              if (val === null || val === undefined || val === '') {
                details.push({ section: 'babyProfile', field, message: 'Field is required.' });
              }
            }

            if (motherProfile.babyProfile.dateOfBirth && motherProfile.babyProfile.dischargeDate) {
              const dob = new Date(motherProfile.babyProfile.dateOfBirth);
              const discharge = new Date(motherProfile.babyProfile.dischargeDate);
              if (dob.getTime() > discharge.getTime()) {
                details.push({
                  section: 'babyProfile',
                  field: 'dischargeDate',
                  message: 'Discharge date cannot be before birth date.',
                });
              }
            }
          }

          // 4.4 Hospital checks
          if (motherProfile.user && motherProfile.hospitalId && motherProfile.user.hospitalId) {
            if (motherProfile.hospitalId !== motherProfile.user.hospitalId) {
              details.push({
                section: 'hospital',
                field: 'hospitalId',
                message: 'User and mother profile hospital links do not match.',
              });
            }
          }
          if (!motherProfile.hospital) {
            details.push({ section: 'hospital', field: 'hospitalId', message: 'Linked hospital not found.' });
          }

          if (details.length > 0) {
            throw createError(
              409,
              'ONBOARDING_INCOMPLETE',
              'Complete all required onboarding steps before finalizing.',
              details
            );
          }

          // 5. Hospital active check (only for new finalization)
          const hospital = motherProfile.hospital!;
          if (!hospital.isActive) {
            throw createError(
              409,
              'HOSPITAL_ENROLLMENT_CLOSED',
              'Enrolment at this hospital is currently closed.'
            );
          }

          // 6. Participant code consistency checks
          const participantCode = motherProfile.participantCode!;
          const studyGroup = motherProfile.studyGroup!;
          
          const parts = participantCode.split('-');
          let consistent = true;
          if (parts.length !== 3) consistent = false;
          if (parts[0] !== hospital.code) consistent = false;
          if (studyGroup === 'study' && parts[1] !== 'S') consistent = false;
          if (studyGroup === 'control' && parts[1] !== 'C') consistent = false;
          if (studyGroup !== 'study' && studyGroup !== 'control') consistent = false;

          const seq = extractSequenceFromParticipantCode(participantCode);
          if (seq === null || seq <= 0) consistent = false;

          const duplicate = await tx.motherProfile.findFirst({
            where: {
              participantCode,
              id: { not: motherProfile.id },
            },
          });
          if (duplicate) consistent = false;

          if (!consistent) {
            throw createError(
              409,
              'PARTICIPANT_CODE_INCONSISTENT',
              'Participant code is inconsistent with the stored hospital and study group.'
            );
          }

          // 7. Calculate and create schedules
          const dischargeDate = motherProfile.babyProfile!.dischargeDate;
          const configs = [
            { timePoint: 'baseline', days: 0 },
            { timePoint: '1_month', days: 30 },
            { timePoint: '3_months', days: 90 },
            { timePoint: '6_months', days: 180 },
          ];

          const schedulesToCreate = [];
          for (const config of configs) {
            const exists = motherProfile.followUpSchedules.some(
              (s) => s.timePoint === config.timePoint
            );
            if (!exists) {
              const scheduledDate = addUtcDays(dischargeDate, config.days);
              schedulesToCreate.push({
                motherProfileId: motherProfile.id,
                timePoint: config.timePoint,
                scheduledDate,
                status: 'pending',
                dataComplete: false,
                actualDate: null,
                collectedByUserId: null,
                notes: null,
              });
            }
          }

          if (schedulesToCreate.length > 0) {
            await tx.followUpSchedule.createMany({
              data: schedulesToCreate,
            });
          }

          // 8. Update onboardingCompletedAt
          const completedAt = new Date();
          await tx.motherProfile.update({
            where: { id: motherProfile.id },
            data: { onboardingCompletedAt: completedAt },
          });

          // Fetch the final list of schedules to return
          const finalSchedules = await tx.followUpSchedule.findMany({
            where: { motherProfileId: motherProfile.id },
          });

          const timePointOrder: Record<string, number> = {
            baseline: 1,
            '1_month': 2,
            '3_months': 3,
            '6_months': 4,
          };
          finalSchedules.sort(
            (a, b) => (timePointOrder[a.timePoint] ?? 99) - (timePointOrder[b.timePoint] ?? 99)
          );

          return {
            completedAt,
            alreadyCompleted: false,
            repairedMissingSchedules: false,
            participantCode,
            studyGroup,
            hospital,
            followUpSchedules: finalSchedules,
          };
        });
        break; // Transaction succeeded, exit retry loop
      } catch (err) {
        const isConflict =
          err instanceof Error &&
          ((err as { code?: string }).code === 'P2025' || (err as { code?: string }).code === 'P2002');

        if (isConflict && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          continue;
        }
        throw err;
      }
    }

    if (!result) {
      throw createError(
        409,
        'FOLLOW_UP_SCHEDULE_CONFLICT',
        'Could not generate follow-up schedules due to concurrent updates.'
      );
    }

    // Format final response
    function formatScheduleResponse(schedule: {
      timePoint: string;
      scheduledDate: Date;
      actualDate: Date | null;
      status: string;
      dataComplete: boolean;
    }) {
      return {
        timePoint: schedule.timePoint,
        scheduledDate: formatDateOnly(schedule.scheduledDate),
        actualDate: schedule.actualDate ? formatDateOnly(schedule.actualDate) : null,
        status: schedule.status,
        dataComplete: schedule.dataComplete,
      };
    }

    if (!result.alreadyCompleted) {
      void recordAudit({
        actorId: req.user?.id,
        actorRole: req.user?.role,
        action: 'onboarding.completed',
        entityType: 'MotherProfile',
        entityId: result.participantCode ?? undefined,
        metadata: { studyGroup: result.studyGroup, hospitalCode: result.hospital?.code },
      });
    }

    res.status(200).json({
      success: true,
      message: result.alreadyCompleted
        ? 'Onboarding was already completed.'
        : 'Onboarding completed successfully.',
      data: {
        onboarding: {
          completed: true,
          completedAt: result.completedAt.toISOString(),
          alreadyCompleted: result.alreadyCompleted,
          participantCode: result.participantCode,
          studyGroup: result.studyGroup,
          hospital: {
            code: result.hospital?.code,
            name: result.hospital?.name,
          },
          ...(result.repairedMissingSchedules ? { repairedMissingSchedules: true } : {}),
        },
        followUpSchedules: result.followUpSchedules.map(formatScheduleResponse),
        nextStep: 'confirm_language',
      },
    });
  } catch (err) {
    next(err);
  }
}
