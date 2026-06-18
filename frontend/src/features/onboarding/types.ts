export type AgeRange =
  | 'below_18'
  | '18_25'
  | '26_30'
  | '31_35'
  | '36_40'
  | 'above_40';

export type EducationLevel =
  | 'no_formal'
  | 'primary'
  | 'secondary'
  | 'higher_secondary'
  | 'graduate'
  | 'postgraduate_plus';

export type MotherOccupation =
  | 'homemaker'
  | 'govt_service'
  | 'private_service'
  | 'business'
  | 'daily_labour'
  | 'other';

export type FatherOccupation =
  | 'unemployed'
  | 'govt_service'
  | 'private_service'
  | 'business'
  | 'daily_labour'
  | 'other';

export type IncomeClass = 'I' | 'II' | 'III' | 'IV' | 'V';

export type FamilyType = 'nuclear' | 'joint' | 'extended';

export type Religion = 'hindu' | 'muslim' | 'christian' | 'other';

export type ResidenceType = 'urban' | 'rural' | 'semi_urban';

export type EducationSource =
  | 'health_worker'
  | 'family'
  | 'peer'
  | 'workshop'
  | 'magazine';

export interface MotherProfileInput {
  fullName?: string | null;
  ageRange: AgeRange;
  educationMother: EducationLevel;
  educationFather: EducationLevel;
  occupationMother: MotherOccupation;
  occupationFather: FatherOccupation;
  incomeClass: IncomeClass;
  familyType: FamilyType;
  familyMembersCount: number;
  religion: Religion;
  residenceType: ResidenceType;
  contactNumber?: string | null;
  prevPretermEducation: boolean;
  educationSource: EducationSource[];
}

export type BabySex = 'male' | 'female';
export type PlaceOfDelivery = 'hospital' | 'home';
export type FeedingAtDischarge = 'exclusive_bf' | 'exclusive_formula' | 'mixed';

export interface BabyProfileInput {
  babyName?: string | null;
  sex: BabySex;
  dateOfBirth: string; // YYYY-MM-DD
  gestationalAgeWeeks: number;
  birthWeightGrams: number;
  weightAtDischargeGrams: number;
  placeOfDelivery: PlaceOfDelivery;
  nicuStayDays: number;
  skinToSkinAtBirth: boolean;
  kmcInNicu: boolean;
  feedingAtDischarge: FeedingAtDischarge;
  criedAtBirth: boolean;
  neededResuscitation: boolean;
  dischargeDate: string; // YYYY-MM-DD
}

export interface HospitalInfo {
  id: string;
  name: string;
  code: string;
}

export interface ParticipantCodeAllocation {
  participantCode: string;
  studyGroup: 'study' | 'control';
  hospital: HospitalInfo;
}

export interface OnboardingCompletionResponse {
  success: boolean;
  message: string;
}
