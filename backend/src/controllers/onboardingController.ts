import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import {
  validateMotherProfileInput,
  validateBabyProfileInput,
  type BabyProfileInput,
  type MotherProfileInput,
} from '../validators/onboardingValidator.js';

function getMotherUserId(req: Request): string {
  if (!req.user) {
    throw createError(401, 'MISSING_TOKEN', 'Authentication required. Please log in.');
  }

  if (req.user.role !== 'mother') {
    throw createError(
      403,
      'FORBIDDEN',
      'Only authenticated mothers can access onboarding profile APIs.'
    );
  }

  return req.user.id;
}

function validationError(message: string): Error {
  return createError(400, 'VALIDATION_ERROR', message);
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
    ageRange: profile.ageRange,
    educationMother: profile.educationMother,
    educationFather: profile.educationFather,
    occupationMother: profile.occupationMother,
    occupationFather: profile.occupationFather,
    incomeClass: profile.incomeClass,
    familyType: profile.familyType,
    familyMembersCount: profile.familyMembersCount,
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
    ageRange: input.ageRange,
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
          validation.errors.map((error) => error.message).join(' ')
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
      message: 'Mother profile saved successfully',
      data: {
        motherProfile: toMotherProfileResponse(motherProfile),
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
          validation.errors.map((error) => error.message).join(' ')
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
      message: 'Baby profile saved successfully',
      data: {
        babyProfile: toBabyProfileResponse(babyProfile),
      },
    });
  } catch (err) {
    next(err);
  }
}
