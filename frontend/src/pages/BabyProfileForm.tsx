import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OnboardingPageShell } from '../components/onboarding/OnboardingPageShell';
import { saveBabyProfile } from '../features/onboarding/api';
import {
  BabyProfileInput,
  BabySex,
  PlaceOfDelivery,
  FeedingAtDischarge,
} from '../features/onboarding/types';
import { ROUTES } from '../routes/paths';
import { InlineFormError } from '../components/feedback/InlineFormError';
import { normalizeApiError } from '../lib/apiError';

export const BabyProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State fields
  const [babyName, setBabyName] = useState('');
  const [sex, setSex] = useState<BabySex | ''>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState('');
  const [birthWeightGrams, setBirthWeightGrams] = useState('');
  const [weightAtDischargeGrams, setWeightAtDischargeGrams] = useState('');
  const [placeOfDelivery, setPlaceOfDelivery] = useState<PlaceOfDelivery | ''>('');
  const [nicuStayDays, setNicuStayDays] = useState('');
  const [skinToSkinAtBirth, setSkinToSkinAtBirth] = useState<boolean | null>(null);
  const [kmcInNicu, setKmcInNicu] = useState<boolean | null>(null);
  const [feedingAtDischarge, setFeedingAtDischarge] = useState<FeedingAtDischarge | ''>('');
  const [criedAtBirth, setCriedAtBirth] = useState<boolean | null>(null);
  const [neededResuscitation, setNeededResuscitation] = useState<boolean | null>(null);
  const [dischargeDate, setDischargeDate] = useState('');

  // Validation & submissions
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Element Refs for focusing first invalid field (satisfying react-hooks/refs)
  const babyNameRef = useRef<HTMLInputElement>(null);
  const sexRef = useRef<HTMLDivElement>(null);
  const dateOfBirthRef = useRef<HTMLInputElement>(null);
  const gestationalAgeWeeksRef = useRef<HTMLInputElement>(null);
  const birthWeightGramsRef = useRef<HTMLInputElement>(null);
  const weightAtDischargeGramsRef = useRef<HTMLInputElement>(null);
  const placeOfDeliveryRef = useRef<HTMLSelectElement>(null);
  const nicuStayDaysRef = useRef<HTMLInputElement>(null);
  const skinToSkinAtBirthRef = useRef<HTMLDivElement>(null);
  const kmcInNicuRef = useRef<HTMLDivElement>(null);
  const feedingAtDischargeRef = useRef<HTMLSelectElement>(null);
  const criedAtBirthRef = useRef<HTMLDivElement>(null);
  const neededResuscitationRef = useRef<HTMLDivElement>(null);
  const dischargeDateRef = useRef<HTMLInputElement>(null);

  const getLocalDateTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const errorKeysOrdered: string[] = [];

    const addError = (field: string, message: string) => {
      errors[field] = message;
      errorKeysOrdered.push(field);
    };

    if (babyName && babyName.length > 100) {
      addError('babyName', t('onboarding.validation.babyNameLength', 'Baby name must not exceed 100 characters.'));
    }

    if (!sex) {
      addError('sex', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    const todayStr = getLocalDateTodayString();

    if (!dateOfBirth) {
      addError('dateOfBirth', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (dateOfBirth > todayStr) {
      addError('dateOfBirth', t('onboarding.validation.futureDate', 'Date must not be in the future.'));
    }

    const ga = parseFloat(gestationalAgeWeeks);
    const decimalParts = gestationalAgeWeeks.split('.');
    if (!gestationalAgeWeeks) {
      addError('gestationalAgeWeeks', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (
      isNaN(ga) ||
      ga < 24.0 ||
      ga >= 37.0 ||
      (decimalParts.length > 1 && decimalParts[1].length > 1)
    ) {
      addError('gestationalAgeWeeks', t('onboarding.validation.gaInvalid', 'Gestational age must be between 24.0 and 36.9 weeks (at most one decimal place).'));
    }

    const birthWeight = parseInt(birthWeightGrams, 10);
    if (!birthWeightGrams) {
      addError('birthWeightGrams', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (isNaN(birthWeight) || birthWeight < 400 || birthWeight > 4000) {
      addError('birthWeightGrams', t('onboarding.validation.birthWeightInvalid', 'Birth weight must be between 400 and 4000 grams.'));
    }

    const dischargeWeight = parseInt(weightAtDischargeGrams, 10);
    if (!weightAtDischargeGrams) {
      addError('weightAtDischargeGrams', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (isNaN(dischargeWeight) || dischargeWeight < 400 || dischargeWeight > 5000) {
      addError('weightAtDischargeGrams', t('onboarding.validation.dischargeWeightInvalid', 'Discharge weight must be between 400 and 5000 grams.'));
    }

    if (!placeOfDelivery) {
      addError('placeOfDelivery', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    const stay = parseInt(nicuStayDays, 10);
    if (!nicuStayDays) {
      addError('nicuStayDays', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (isNaN(stay) || stay < 1 || stay > 120) {
      addError('nicuStayDays', t('onboarding.validation.nicuStayInvalid', 'NICU stay must be between 1 and 120 days.'));
    }

    if (skinToSkinAtBirth === null) {
      addError('skinToSkinAtBirth', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    if (kmcInNicu === null) {
      addError('kmcInNicu', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    if (!feedingAtDischarge) {
      addError('feedingAtDischarge', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    if (criedAtBirth === null) {
      addError('criedAtBirth', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    if (neededResuscitation === null) {
      addError('neededResuscitation', t('onboarding.validation.fieldRequired', 'This field is required.'));
    }

    if (!dischargeDate) {
      addError('dischargeDate', t('onboarding.validation.fieldRequired', 'This field is required.'));
    } else if (dischargeDate > todayStr) {
      addError('dischargeDate', t('onboarding.validation.futureDate', 'Date must not be in the future.'));
    } else if (dateOfBirth && dischargeDate < dateOfBirth) {
      addError('dischargeDate', t('onboarding.validation.dischargeBeforeBirth', 'Discharge date must not be earlier than birth date.'));
    }

    setFieldErrors(errors);

    if (errorKeysOrdered.length > 0) {
      const fieldRefs: Record<string, React.RefObject<unknown>> = {
        babyName: babyNameRef,
        sex: sexRef,
        dateOfBirth: dateOfBirthRef,
        gestationalAgeWeeks: gestationalAgeWeeksRef,
        birthWeightGrams: birthWeightGramsRef,
        weightAtDischargeGrams: weightAtDischargeGramsRef,
        placeOfDelivery: placeOfDeliveryRef,
        nicuStayDays: nicuStayDaysRef,
        skinToSkinAtBirth: skinToSkinAtBirthRef,
        kmcInNicu: kmcInNicuRef,
        feedingAtDischarge: feedingAtDischargeRef,
        criedAtBirth: criedAtBirthRef,
        neededResuscitation: neededResuscitationRef,
        dischargeDate: dischargeDateRef,
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
      const payload: BabyProfileInput = {
        babyName: babyName.trim() || null,
        sex: sex as BabySex,
        dateOfBirth,
        gestationalAgeWeeks: parseFloat(gestationalAgeWeeks),
        birthWeightGrams: parseInt(birthWeightGrams, 10),
        weightAtDischargeGrams: parseInt(weightAtDischargeGrams, 10),
        placeOfDelivery: placeOfDelivery as PlaceOfDelivery,
        nicuStayDays: parseInt(nicuStayDays, 10),
        skinToSkinAtBirth: !!skinToSkinAtBirth,
        kmcInNicu: !!kmcInNicu,
        feedingAtDischarge: feedingAtDischarge as FeedingAtDischarge,
        criedAtBirth: !!criedAtBirth,
        neededResuscitation: !!neededResuscitation,
        dischargeDate,
      };

      await saveBabyProfile(payload);
      navigate(ROUTES.HOSPITAL_CODE);
    } catch (err: unknown) {
      const error = normalizeApiError(err);
      if (error.code === 'STRATUM_OUT_OF_BOUNDS') {
        setFormError(t('onboarding.validation.birthWeightInvalid'));
      } else if (error.details && error.details.length > 0) {
        // Surface the specific field-level reason instead of the generic
        // "Some profile fields are invalid." envelope message.
        setFormError(error.details.map((d) => d.message).join(' '));
      } else {
        setFormError(error.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingPageShell
      title={t('onboarding.baby.title', 'Baby’s Details')}
      subtitle={t('onboarding.baby.subtitle', 'Enter the information from the NICU discharge record.')}
      currentStep={2}
      onBack={() => navigate(ROUTES.MOTHER_PROFILE)}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2" noValidate>
        {formError && <InlineFormError message={formError} />}

        {/* Baby Name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="babyName" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.babyName')} <span className="text-text-muted font-normal">{t('onboarding.common.optional')}</span>
          </label>
          <input
            id="babyName"
            ref={babyNameRef}
            type="text"
            value={babyName}
            onChange={(e) => {
              setBabyName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, babyName: '' }));
            }}
            disabled={isSubmitting}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.babyName ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
            maxLength={100}
          />
          {fieldErrors.babyName && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.babyName}
            </span>
          )}
        </div>

        {/* Sex */}
        <div className="flex flex-col gap-1.5 w-full" ref={sexRef} tabIndex={-1}>
          <span className="font-sans text-xs font-semibold text-text">{t('onboarding.baby.sex')} *</span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="sex"
                checked={sex === 'male'}
                onChange={() => {
                  setSex('male');
                  setFieldErrors((prev) => ({ ...prev, sex: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.baby.sexOptions.male')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="sex"
                checked={sex === 'female'}
                onChange={() => {
                  setSex('female');
                  setFieldErrors((prev) => ({ ...prev, sex: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.baby.sexOptions.female')}
            </label>
          </div>
          {fieldErrors.sex && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.sex}
            </span>
          )}
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="dateOfBirth" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.dateOfBirth')} *
          </label>
          <input
            id="dateOfBirth"
            ref={dateOfBirthRef}
            type="date"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              setFieldErrors((prev) => ({ ...prev, dateOfBirth: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.dateOfBirth ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.dateOfBirth ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.dateOfBirth && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.dateOfBirth}
            </span>
          )}
        </div>

        {/* Gestational Age Weeks */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="gestationalAgeWeeks" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.gestationalAgeWeeks')} *
          </label>
          <input
            id="gestationalAgeWeeks"
            ref={gestationalAgeWeeksRef}
            type="number"
            step="0.1"
            value={gestationalAgeWeeks}
            onChange={(e) => {
              setGestationalAgeWeeks(e.target.value);
              setFieldErrors((prev) => ({ ...prev, gestationalAgeWeeks: '' }));
            }}
            placeholder="e.g. 32.5"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.gestationalAgeWeeks ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.gestationalAgeWeeks ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.gestationalAgeWeeks && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.gestationalAgeWeeks}
            </span>
          )}
        </div>

        {/* Birth Weight Grams */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="birthWeightGrams" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.birthWeightGrams')} *
          </label>
          <input
            id="birthWeightGrams"
            ref={birthWeightGramsRef}
            type="number"
            inputMode="numeric"
            value={birthWeightGrams}
            onChange={(e) => {
              setBirthWeightGrams(e.target.value);
              setFieldErrors((prev) => ({ ...prev, birthWeightGrams: '' }));
            }}
            placeholder="e.g. 1800"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.birthWeightGrams ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.birthWeightGrams ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.birthWeightGrams && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.birthWeightGrams}
            </span>
          )}
        </div>

        {/* Weight At Discharge Grams */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="weightAtDischargeGrams" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.weightAtDischargeGrams')} *
          </label>
          <input
            id="weightAtDischargeGrams"
            ref={weightAtDischargeGramsRef}
            type="number"
            inputMode="numeric"
            value={weightAtDischargeGrams}
            onChange={(e) => {
              setWeightAtDischargeGrams(e.target.value);
              setFieldErrors((prev) => ({ ...prev, weightAtDischargeGrams: '' }));
            }}
            placeholder="e.g. 2100"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.weightAtDischargeGrams ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.weightAtDischargeGrams ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.weightAtDischargeGrams && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.weightAtDischargeGrams}
            </span>
          )}
        </div>

        {/* Place of Delivery */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="placeOfDelivery" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.placeOfDelivery')} *
          </label>
          <select
            id="placeOfDelivery"
            ref={placeOfDeliveryRef}
            value={placeOfDelivery}
            onChange={(e) => {
              setPlaceOfDelivery(e.target.value as PlaceOfDelivery);
              setFieldErrors((prev) => ({ ...prev, placeOfDelivery: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.placeOfDelivery ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.placeOfDelivery ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            <option value="hospital">{t('onboarding.baby.placeOfDeliveryOptions.hospital')}</option>
            <option value="home">{t('onboarding.baby.placeOfDeliveryOptions.home')}</option>
          </select>
          {fieldErrors.placeOfDelivery && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.placeOfDelivery}
            </span>
          )}
        </div>

        {/* NICU Stay Days */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="nicuStayDays" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.nicuStayDays')} *
          </label>
          <input
            id="nicuStayDays"
            ref={nicuStayDaysRef}
            type="number"
            inputMode="numeric"
            value={nicuStayDays}
            onChange={(e) => {
              setNicuStayDays(e.target.value);
              setFieldErrors((prev) => ({ ...prev, nicuStayDays: '' }));
            }}
            placeholder="e.g. 15"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.nicuStayDays ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.nicuStayDays ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.nicuStayDays && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.nicuStayDays}
            </span>
          )}
        </div>

        {/* Skin to Skin Contact at Birth */}
        <div className="flex flex-col gap-1.5 w-full" ref={skinToSkinAtBirthRef} tabIndex={-1}>
          <span className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.skinToSkinAtBirth')} *
          </span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="skinToSkinAtBirth"
                checked={skinToSkinAtBirth === true}
                onChange={() => {
                  setSkinToSkinAtBirth(true);
                  setFieldErrors((prev) => ({ ...prev, skinToSkinAtBirth: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.yes')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="skinToSkinAtBirth"
                checked={skinToSkinAtBirth === false}
                onChange={() => {
                  setSkinToSkinAtBirth(false);
                  setFieldErrors((prev) => ({ ...prev, skinToSkinAtBirth: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.no')}
            </label>
          </div>
          {fieldErrors.skinToSkinAtBirth && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.skinToSkinAtBirth}
            </span>
          )}
        </div>

        {/* KMC provided in NICU */}
        <div className="flex flex-col gap-1.5 w-full" ref={kmcInNicuRef} tabIndex={-1}>
          <span className="font-sans text-xs font-semibold text-text">{t('onboarding.baby.nicuKmc')} *</span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="kmcInNicu"
                checked={kmcInNicu === true}
                onChange={() => {
                  setKmcInNicu(true);
                  setFieldErrors((prev) => ({ ...prev, kmcInNicu: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.yes')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="kmcInNicu"
                checked={kmcInNicu === false}
                onChange={() => {
                  setKmcInNicu(false);
                  setFieldErrors((prev) => ({ ...prev, kmcInNicu: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.no')}
            </label>
          </div>
          {fieldErrors.kmcInNicu && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.kmcInNicu}
            </span>
          )}
        </div>

        {/* Feeding type at discharge */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="feedingAtDischarge" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.feedingAtDischarge')} *
          </label>
          <select
            id="feedingAtDischarge"
            ref={feedingAtDischargeRef}
            value={feedingAtDischarge}
            onChange={(e) => {
              setFeedingAtDischarge(e.target.value as FeedingAtDischarge);
              setFieldErrors((prev) => ({ ...prev, feedingAtDischarge: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.feedingAtDischarge ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 bg-surface ${
              fieldErrors.feedingAtDischarge ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border text-text'
            }`}
          >
            <option value="">{t('onboarding.mother.selectOption')}</option>
            <option value="exclusive_bf">{t('onboarding.baby.feedingOptions.exclusive_bf')}</option>
            <option value="exclusive_formula">{t('onboarding.baby.feedingOptions.exclusive_formula')}</option>
            <option value="mixed">{t('onboarding.baby.feedingOptions.mixed')}</option>
          </select>
          {fieldErrors.feedingAtDischarge && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.feedingAtDischarge}
            </span>
          )}
        </div>

        {/* Cried after birth */}
        <div className="flex flex-col gap-1.5 w-full" ref={criedAtBirthRef} tabIndex={-1}>
          <span className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.criedAtBirth')} *
          </span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="criedAtBirth"
                checked={criedAtBirth === true}
                onChange={() => {
                  setCriedAtBirth(true);
                  setFieldErrors((prev) => ({ ...prev, criedAtBirth: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.yes')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="criedAtBirth"
                checked={criedAtBirth === false}
                onChange={() => {
                  setCriedAtBirth(false);
                  setFieldErrors((prev) => ({ ...prev, criedAtBirth: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.no')}
            </label>
          </div>
          {fieldErrors.criedAtBirth && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.criedAtBirth}
            </span>
          )}
        </div>

        {/* Needed resuscitation */}
        <div className="flex flex-col gap-1.5 w-full" ref={neededResuscitationRef} tabIndex={-1}>
          <span className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.neededResuscitation')} *
          </span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="neededResuscitation"
                checked={neededResuscitation === true}
                onChange={() => {
                  setNeededResuscitation(true);
                  setFieldErrors((prev) => ({ ...prev, neededResuscitation: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.yes')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-text">
              <input
                type="radio"
                name="neededResuscitation"
                checked={neededResuscitation === false}
                onChange={() => {
                  setNeededResuscitation(false);
                  setFieldErrors((prev) => ({ ...prev, neededResuscitation: '' }));
                }}
                disabled={isSubmitting}
                className="h-4 w-4 border-border text-primary focus:ring-primary focus-visible:outline-primary"
              />
              {t('onboarding.common.no')}
            </label>
          </div>
          {fieldErrors.neededResuscitation && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.neededResuscitation}
            </span>
          )}
        </div>

        {/* Discharge Date */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="dischargeDate" className="font-sans text-xs font-semibold text-text">
            {t('onboarding.baby.dischargeDate')} *
          </label>
          <input
            id="dischargeDate"
            ref={dischargeDateRef}
            type="date"
            value={dischargeDate}
            onChange={(e) => {
              setDischargeDate(e.target.value);
              setFieldErrors((prev) => ({ ...prev, dischargeDate: '' }));
            }}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.dischargeDate ? 'true' : 'false'}
            className={`w-full min-h-[48px] px-4 rounded-xl border text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
              fieldErrors.dischargeDate ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
            }`}
          />
          {fieldErrors.dischargeDate && (
            <span className="font-sans text-xs text-error font-medium" role="alert">
              {fieldErrors.dischargeDate}
            </span>
          )}
        </div>

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
