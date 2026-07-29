import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { InlineFormError } from '../../components/feedback/InlineFormError';
import {
  adminFetchArticle,
  createArticle,
  updateArticle,
  uploadMedia,
} from '../../features/learningAdmin/api';
import type { CreateArticleInput } from '../../features/learningAdmin/types';
import { normalizeApiError } from '../../lib/apiError';
import { ROUTES } from '../../routes/paths';

const CATEGORIES = [
  'feeding', 'kmc', 'growth', 'danger_signs',
  'emotional_support', 'immunization', 'newborn_care',
] as const;

const STATUSES = ['draft', 'published', 'archived'] as const;

type UploadField = 'coverImage' | 'audio' | 'video';
type UploadState = 'idle' | 'uploading' | 'error';

interface FieldErrors {
  [field: string]: string;
}

export const ArticleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('feeding');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<typeof STATUSES[number]>(isEdit ? 'draft' : 'published');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // UI state
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadStates, setUploadStates] = useState<Record<UploadField, UploadState>>({
    coverImage: 'idle',
    audio: 'idle',
    video: 'idle',
  });
  const [uploadErrors, setUploadErrors] = useState<Record<UploadField, string>>({
    coverImage: '',
    audio: '',
    video: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const coverFileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit || !id) return;
    setFetchLoading(true);
    adminFetchArticle(id)
      .then((a) => {
        setTitle(a.title);
        setCategory(a.category as typeof CATEGORIES[number]);
        setTags(a.tags.join(', '));
        setBody(a.body);
        setStatus(a.status);
        setCoverImageUrl(a.coverImageUrl ?? '');
        setAudioUrl(a.audioUrl ?? '');
        setVideoUrl(a.videoUrl ?? '');
      })
      .catch((err) => setGlobalError(normalizeApiError(err).message))
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const handleFileUpload = async (field: UploadField, file: File) => {
    setUploadStates((prev) => ({ ...prev, [field]: 'uploading' }));
    setUploadErrors((prev) => ({ ...prev, [field]: '' }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadMedia(formData);
      if (field === 'coverImage') setCoverImageUrl(res.url);
      else if (field === 'audio') setAudioUrl(res.url);
      else setVideoUrl(res.url);
      setUploadStates((prev) => ({ ...prev, [field]: 'idle' }));
    } catch (err) {
      setUploadStates((prev) => ({ ...prev, [field]: 'error' }));
      setUploadErrors((prev) => ({
        ...prev,
        [field]: normalizeApiError(err).message,
      }));
    }
  };

  const onFileChange = (field: UploadField) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFileUpload(field, file);
  };

  const isAnyUploading = Object.values(uploadStates).some((s) => s === 'uploading');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    // Client-side validation
    const errs: FieldErrors = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!body.trim()) errs.body = 'Body is required';
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    const input: CreateArticleInput = {
      title: title.trim(),
      body: body.trim(),
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      status,
      coverImageUrl: coverImageUrl || null,
      audioUrl: audioUrl || null,
      videoUrl: videoUrl || null,
    };

    setSubmitLoading(true);
    try {
      if (isEdit && id) {
        await updateArticle(id, input);
      } else {
        await createArticle(input);
      }
      navigate(ROUTES.ADMIN_LEARNING_ARTICLES);
    } catch (err) {
      const normalized = normalizeApiError(err);
      if (normalized.status === 422 && normalized.details) {
        const fe: FieldErrors = {};
        for (const d of normalized.details) {
          if (d.field) fe[d.field] = d.message;
        }
        setFieldErrors(fe);
      } else {
        setGlobalError(normalized.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="care-canvas min-h-screen">
        <AdminHeader />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="care-canvas min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-3xl p-5 lg:p-8">
        {/* Page heading */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_LEARNING_ARTICLES)}
            className="mb-2 text-sm font-semibold text-primary"
          >
            ← Articles
          </button>
          <h1 className="font-sans text-2xl font-extrabold text-text">
            {isEdit ? 'Edit Article' : 'New Article'}
          </h1>
        </div>

        {globalError && <InlineFormError message={globalError} />}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6" noValidate>
          {/* Title */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-semibold text-text" htmlFor="title">
                Title
              </label>
              <span className="text-xs text-amber-600 font-medium">বাংলায় লিখুন</span>
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="নিবন্ধের শিরোনাম"
            />
            {fieldErrors.title && <InlineFormError message={fieldErrors.title} />}
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-text" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace('_', ' ')}</option>
              ))}
            </select>
            {fieldErrors.category && <InlineFormError message={fieldErrors.category} />}
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-text" htmlFor="tags">
              Tags <span className="text-text-muted font-normal">(comma-separated)</span>
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="kmc, preterm"
            />
          </div>

          {/* Body */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-semibold text-text" htmlFor="body">
                Body <span className="text-text-muted font-normal">(Markdown)</span>
              </label>
              <span className="text-xs text-amber-600 font-medium">বাংলায় লিখুন</span>
            </div>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              placeholder="নিবন্ধের বিষয়বস্তু এখানে লিখুন..."
            />
            {fieldErrors.body && <InlineFormError message={fieldErrors.body} />}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-text" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof STATUSES[number])}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                status === 'published'
                  ? 'border-green-400 bg-green-50 text-green-800'
                  : status === 'archived'
                  ? 'border-slate-300 bg-slate-50 text-slate-600'
                  : 'border-amber-400 bg-amber-50 text-amber-800'
              }`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === 'published' ? '✅ published — visible to patients' : s === 'draft' ? '⚠️ draft — hidden from patients' : '🗄 archived'}</option>
              ))}
            </select>
            {status === 'draft' && (
              <p className="mt-1.5 text-xs font-semibold text-amber-700">
                ⚠️ Draft articles are NOT visible to mothers. Change to "published" to make it live.
              </p>
            )}
          </div>

          {/* Cover image */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-text">
              Cover Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => coverFileRef.current?.click()}
                disabled={uploadStates.coverImage === 'uploading'}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-text hover:bg-primary/5 disabled:opacity-50"
              >
                {uploadStates.coverImage === 'uploading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden="true" />
                )}
                Upload
              </button>
              <input
                ref={coverFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange('coverImage')}
              />
            </div>
            {uploadErrors.coverImage && <InlineFormError message={uploadErrors.coverImage} />}
            {fieldErrors.coverImageUrl && <InlineFormError message={fieldErrors.coverImageUrl} />}
          </div>

          {/* Audio */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-text">Audio</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => audioFileRef.current?.click()}
                disabled={uploadStates.audio === 'uploading'}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-text hover:bg-primary/5 disabled:opacity-50"
              >
                {uploadStates.audio === 'uploading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden="true" />
                )}
                Upload
              </button>
              <input
                ref={audioFileRef}
                type="file"
                accept="audio/mpeg,audio/ogg,audio/mp4"
                className="hidden"
                onChange={onFileChange('audio')}
              />
            </div>
            {uploadErrors.audio && <InlineFormError message={uploadErrors.audio} />}
            {fieldErrors.audioUrl && <InlineFormError message={fieldErrors.audioUrl} />}
          </div>

          {/* Video */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-text">Video</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => videoFileRef.current?.click()}
                disabled={uploadStates.video === 'uploading'}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-text hover:bg-primary/5 disabled:opacity-50"
              >
                {uploadStates.video === 'uploading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden="true" />
                )}
                Upload
              </button>
              <input
                ref={videoFileRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={onFileChange('video')}
              />
            </div>
            {uploadErrors.video && <InlineFormError message={uploadErrors.video} />}
            {fieldErrors.videoUrl && <InlineFormError message={fieldErrors.videoUrl} />}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_LEARNING_ARTICLES)}
              className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-text hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || isAnyUploading}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {(submitLoading || isAnyUploading) && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {isEdit ? 'Save Changes' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
