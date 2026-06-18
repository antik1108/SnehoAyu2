import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OnboardingPageShell } from '../components/onboarding/OnboardingPageShell';
import { saveMotherProfile } from '../features/onboarding/api';
import {
  MotherProfileInput,
  AgeRange,
  EducationLevel,
  MotherOccupation,
  FatherOccupation,
  IncomeClass,
  FamilyType,
  Religion,
  ResidenceType,
  EducationSource,
} from '../features/onboarding/types';
import { ROUTES } from '../routes/paths';
import { InlineFormError } from '../components/feedback/InlineFormError';

export const MotherProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State fields
  const [fullName, setFullName] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRange | ''>('');
  const [educationMother, setEducationMother] = useState<EducationLevel | ''>('');
  const [educationFather, setEducationFather] = useState<EducationLevel | ''>('');
  const [occupationMother, setOccupationMother] = useState<MotherOccupation | ''>('');
  const [occupationFather, setOccupationFather] = useState<FatherOccupation | ''>('');
  const [incomeClass, setIncomeClass] = useState<IncomeClass | ''>('');
  const [familyType, setFamilyType] = useState<FamilyType | ''>('');
  const [familyMembersCount, setFamilyMembersCount] = useState('');
  const [religion, setReligion] = useState<Religion | ''>('');
  const [residenceType, setResidenceType] = useState<ResidenceType | ''>('');
  const [contactNumber, setContactNumber] = useState('');
  const [prevPretermEducation, setPrevPretermEducation] = useState<boolean | null>(null);
  const [educationSources, setEducationSources] = useState<EducationSource[]>([]);

  // Validation & submissions
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Element Refs for focusing first invalid field (satisfying react-hooks/refs)
  const ageRangeRef = useRef<HTMLSelectElement>(null);
  const educationMotherRef = useRef<HTMLSelectElement>(null);
  const educationFatherRef = useRef<HTMLSelectElement>(null);
  const occupationMotherRef = useRef<HTMLSelectElement>(null);
  const occupationFatherRef = useRef<HTMLSelectElement>(null);
  const incomeClassRef = useRef<HTMLSelectElement>(null);
  const familyTypeRef = useRef<HTMLSelectElement>(null);
  const familyMembersCountRef = useRef<HTMLInputElement>(null);
  const religionRef = useRef<HTMLSelectElement>(null);
  const residenceTypeRef = useRef<HTMLSelectElement>(null);
  const contactNumberRef = useRef<HTMLInputElement>(null);
  const prevPretermEducationRef = useRef<HTMLDivElement>(null);
  const educationSourceRef = useRef<HTMLDivElement>(null);

  const handleSourceCheckbox = (source: EducationSource) => {
    setEducationSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
    if (fieldErrors.educationSource) {
      setFieldErrors((prev) => ({ ...prev, educationSource: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const errorKeysOrdered: string[] = [];

    const addError = (field: string, message: string) => {
      errors[field] = message;
      errorKeysOrdered.push(field);
    };

    if (!ageRange) {
      addError('ageRange', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!educationMother) {
      addError('educationMother', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!educationFather) {
      addError('educationFather', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!occupationMother) {
      addError('occupationMother', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!occupationFather) {
      addError('occupationFather', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!incomeClass) {
      addError('incomeClass', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!familyType) {
      addError('familyType', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    const familyCountNum = parseInt(familyMembersCount, 10);
    if (!familyMembersCount) {
      addError('familyMembersCount', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (isNaN(familyCountNum) || familyCountNum < 1 || familyCountNum > 30) {
      addError('familyMembersCount', t('onboarding.validation.familyCountInvalid', 'Family members count must be an integer between 1 and 30.'));
    }

    if (!religion) {
      addError('religion', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }
    if (!residenceType) {
      addError('residenceType', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    if (contactNumber && !/^[6-9]\d{9}$/.test(contactNumber)) {
      addError('contactNumber', t('onboarding.validation.contactInvalid', 'Contact number must be a valid 10-digit Indian mobile number.'));
    }

    if (prevPretermEducation === null) {
      addError('prevPretermEducation', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (prevPretermEducation === true && educationSources.length === 0) {
      addError('educationSource', t('onboarding.validation.sourceRequired', 'At least one source of information must be selected.'));
    }

    setFieldErrors(errors);

    if (errorKeysOrdered.length > 0) {
      const fieldRefs: Record<string, React.RefObject<unknown>> = {
        ageRange: ageRangeRef,
        educationMother: educationMotherRef,
        educationFather: educationFatherRef,
        occupationMother: occupationMotherRef,
        occupationFather: occupationFatherRef,
        incomeClass: incomeClassRef,
        familyType: familyTypeRef,
        familyMembersCount: familyMembersCountRef,
        religion: religionRef,
        residenceType: residenceTypeRef,
        contactNumber: contactNumberRef,
        prevPretermEducation: prevPretermEducationRef,
        educationSource: educationSourceRef,
      };

      const firstErrorField = errorKeysOrdered[0];
      const targetRef = fieldRefs[firstErrorField];
      if (targetRef && targetRef.current) {
        const element = targetRef.current as HTMLElement;
        element.focus();
        if (typeof element.scrollIntoView === 'function') {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: MotherProfileInput = {
        fullName: fullName.trim() || null,
        ageRange: ageRange as AgeRange,
        educationMother: educationMother as EducationLevel,
        educationFather: educationFather as EducationLevel,
        occupationMother: occupationMother as MotherOccupation,
        occupationFather: occupationFather as FatherOccupation,
        incomeClass: incomeClass as IncomeClass,
        familyType: familyType as FamilyType,
        familyMembersCount: parseInt(familyMembersCount, 10),
        religion: religion as Religion,
        residenceType: residenceType as ResidenceType,
        contactNumber: contactNumber || null,
        prevPretermEducation: !!prevPretermEducation,
        educationSource: prevPretermEducation ? educationSources : [],
      };

      await saveMotherProfile(payload);
      navigate(ROUTES.BABY_PROFILE);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setFormError(error.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper arrays for mapping dropdown options
  const ageRanges: AgeRange[] = ['below_18', '18_25', '26_30', '31_35', '36_40', 'above_40'];
  const educationLevels: EducationLevel[] = ['no_formal', 'primary', 'secondary', 'higher_secondary', 'graduate', 'postgraduate_plus'];
  const motherOccupations: MotherOccupation[] = ['homemaker', 'govt_service', 'private_service', 'business', 'daily_labour', 'other'];
  const fatherOccupations: FatherOccupation[] = ['unemployed', 'govt_service', 'private_service', 'business', 'daily_labour', 'other'];
  const incomeClasses: IncomeClass[] = ['I', 'II', 'III', 'IV', 'V'];
  const familyTypes: FamilyType[] = ['nuclear', 'joint', 'extended'];
  const religions: Religion[] = ['hindu', 'muslim', 'christian', 'other'];
  const residenceTypes: ResidenceType[] = ['urban', 'rural', 'semi_urban'];
  const infoSources: EducationSource[] = ['health_worker', 'family', 'peer', 'workshop', 'magazine'];

  return (
    <OnboardingPageShell
      title={t('onboarding.mother.title', 'Mother’s Details')}
      subtitle={t('onboarding.mother.subtitle', 'Please complete the mother’s demographic information.')}
      currentStep={1}
      showBackButton={false}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2" noValidate>
        {formError && <InlineFormError message={formError} />}

        {/* Full Name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="fullName" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.fullName')} <span className="text-text-muted font-normal">{t('onboarding.common.optional')}</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            maxLength={100}
          />
        </div>

        {/* Age Range */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="ageRange" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.ageRange')} *
          </label>
          <select
            id="ageRange"
            ref={ageRangeRef}
            value={ageRange}
            onChange={(e) => {
              setAgeRange(e.target.value as AgeRange);
              setFieldErrors((prev) => ({ ...prev, ageRange: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.ageRange ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.ageRange ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {ageRanges.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.ageRangeOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.ageRange && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.ageRange}
            </span>
          )}
        </div>

        {/* Mother Education */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="educationMother" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.educationMother')} *
          </label>
          <select
            id="educationMother"
            ref={educationMotherRef}
            value={educationMother}
            onChange={(e) => {
              setEducationMother(e.target.value as EducationLevel);
              setFieldErrors((prev) => ({ ...prev, educationMother: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.educationMother ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.educationMother ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {educationLevels.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.educationOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.educationMother && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.educationMother}
            </span>
          )}
        </div>

        {/* Father Education */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="educationFather" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.educationFather')} *
          </label>
          <select
            id="educationFather"
            ref={educationFatherRef}
            value={educationFather}
            onChange={(e) => {
              setEducationFather(e.target.value as EducationLevel);
              setFieldErrors((prev) => ({ ...prev, educationFather: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.educationFather ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.educationFather ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {educationLevels.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.educationOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.educationFather && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.educationFather}
            </span>
          )}
        </div>

        {/* Mother Occupation */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="occupationMother" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.occupationMother')} *
          </label>
          <select
            id="occupationMother"
            ref={occupationMotherRef}
            value={occupationMother}
            onChange={(e) => {
              setOccupationMother(e.target.value as MotherOccupation);
              setFieldErrors((prev) => ({ ...prev, occupationMother: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.occupationMother ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.occupationMother ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {motherOccupations.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.motherOccupationOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.occupationMother && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.occupationMother}
            </span>
          )}
        </div>

        {/* Father Occupation */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="occupationFather" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.occupationFather')} *
          </label>
          <select
            id="occupationFather"
            ref={occupationFatherRef}
            value={occupationFather}
            onChange={(e) => {
              setOccupationFather(e.target.value as FatherOccupation);
              setFieldErrors((prev) => ({ ...prev, occupationFather: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.occupationFather ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.occupationFather ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {fatherOccupations.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.fatherOccupationOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.occupationFather && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.occupationFather}
            </span>
          )}
        </div>

        {/* Income Class */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="incomeClass" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.incomeClass')} *
          </label>
          <select
            id="incomeClass"
            ref={incomeClassRef}
            value={incomeClass}
            onChange={(e) => {
              setIncomeClass(e.target.value as IncomeClass);
              setFieldErrors((prev) => ({ ...prev, incomeClass: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.incomeClass ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.incomeClass ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {incomeClasses.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.incomeClassOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.incomeClass && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.incomeClass}
            </span>
          )}
        </div>

        {/* Family Type */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="familyType" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.familyType')} *
          </label>
          <select
            id="familyType"
            ref={familyTypeRef}
            value={familyType}
            onChange={(e) => {
              setFamilyType(e.target.value as FamilyType);
              setFieldErrors((prev) => ({ ...prev, familyType: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.familyType ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.familyType ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {familyTypes.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.familyTypeOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.familyType && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.familyType}
            </span>
          )}
        </div>

        {/* Family Members Count */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="familyMembersCount" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.familyMembersCount')} *
          </label>
          <input
            id="familyMembersCount"
            ref={familyMembersCountRef}
            type="number"
            inputMode="numeric"
            value={familyMembersCount}
            onChange={(e) => {
              setFamilyMembersCount(e.target.value);
              setFieldErrors((prev) => ({ ...prev, familyMembersCount: '' }));
            }}
            disabled={isSubmitting}
            min={1}
            max={30}
            aria-invalid={fieldErrors.familyMembersCount ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.familyMembersCount ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.familyMembersCount && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.familyMembersCount}
            </span>
          )}
        </div>

        {/* Religion */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="religion" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.religion')} *
          </label>
          <select
            id="religion"
            ref={religionRef}
            value={religion}
            onChange={(e) => {
              setReligion(e.target.value as Religion);
              setFieldErrors((prev) => ({ ...prev, religion: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.religion ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.religion ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {religions.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.religionOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.religion && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.religion}
            </span>
          )}
        </div>

        {/* Residence Type */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="residenceType" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.residenceType')} *
          </label>
          <select
            id="residenceType"
            ref={residenceTypeRef}
            value={residenceType}
            onChange={(e) => {
              setResidenceType(e.target.value as ResidenceType);
              setFieldErrors((prev) => ({ ...prev, residenceType: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.residenceType ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.residenceType ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            {residenceTypes.map((val) => (
              <option key={val} value={val}>
                {t(`onboarding.mother.residenceOptions.${val}`)}
              </option>
            ))}
          </select>
          {fieldErrors.residenceType && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.residenceType}
            </span>
          )}
        </div>

        {/* Alternate contact number */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="contactNumber" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.contactNumber')} <span className="text-text-muted font-normal">{t('onboarding.common.optional')}</span>
          </label>
          <input
            id="contactNumber"
            ref={contactNumberRef}
            type="tel"
            inputMode="numeric"
            value={contactNumber}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
              setContactNumber(cleaned);
              setFieldErrors((prev) => ({ ...prev, contactNumber: '' }));
            }}
            placeholder="9876543210"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.contactNumber ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.contactNumber ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.contactNumber && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.contactNumber}
            </span>
          )}
        </div>

        {/* Prev Preterm Education (Yes/No Radio Group) */}
        <div className="flex flex-col gap-1.5 w-full" ref={prevPretermEducationRef} tabIndex={-1}>
          <span className="font-sans text-xs font-semibold text-text">
            {t('onboarding.mother.prevPretermEducation')} *
          </span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="prevPretermEducation"
                checked={prevPretermEducation === true}
                onChange={() => {
                  setPrevPretermEducation(true);
                  setFieldErrors((prev) => ({ ...prev, prevPretermEducation: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.yes')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="prevPretermEducation"
                checked={prevPretermEducation === false}
                onChange={() => {
                  setPrevPretermEducation(false);
                  setEducationSources([]);
                  setFieldErrors((prev) => ({ ...prev, prevPretermEducation: '', educationSource: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.no')}
            </label>
          </div>
          {fieldErrors.prevPretermEducation && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.prevPretermEducation}
            </span>
          )}
        </div>

        {/* Conditional Info Sources Checkbox Group */}
        {prevPretermEducation === true && (
          <div className="flex flex-col gap-2 w-full border border-border/60 bg-slate-50/50 p-4 rounded-xl" ref={educationSourceRef} tabIndex={-1}>
            <span className="font-sans text-xs font-semibold text-text">
              {t('onboarding.mother.educationSource')} *
            </span>
            <div className="flex flex-col gap-2 mt-1">
              {infoSources.map((source) => (
                <label key={source} className="flex items-center gap-2.5 cursor-pointer font-sans text-sm text-text">
                  <input
                    type="checkbox"
                    checked={educationSources.includes(source)}
                    onChange={() => handleSourceCheckbox(source)}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus-visible:outline-primary"
                  />
                  {t(`onboarding.mother.sourceOptions.${source}`)}
                </label>
              ))}
            </div>
            {fieldErrors.educationSource && (
              <span className="font-sans text-xs text-error font-medium" role="alert">
                {fieldErrors.educationSource}
              </span>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full min-h-[48px] mt-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center transition-all cursor-pointer hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isSubmitting ? t('onboarding.common.saving', 'Saving…') : t('onboarding.common.saveAndContinue', 'Save and Continue')}
        </button>
      </form>
    </OnboardingPageShell>
  );
};
