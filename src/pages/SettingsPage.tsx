import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { fetchProfile, updateProfile, uploadAvatar } from "@/services/accountService";
import { LoadingSpinner } from "@/components/ui";
import AppIcon from "@/components/ui/AppIcon";
import SettingsCard from "@/components/settings/SettingsCard";
import SettingsField from "@/components/settings/SettingsField";
import SettingsToggle from "@/components/settings/SettingsToggle";
import AvatarUpload from "@/components/settings/AvatarUpload";
import type { BusinessProfile } from "@/types";

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  sole_trader: "Sole Trader / Self-employed",
  limited_company: "Limited Company",
  partnership: "Partnership",
};

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [user]);

  const handleUpdate = useCallback(
    (field: string, value: string | boolean | number | null) => {
      setProfile((prev) => prev ? { ...prev, [field]: value } as BusinessProfile : prev);
      setSaved(false);
    },
    []
  );

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    try {
      // Strip read-only fields before sending to Supabase
      const { id, user_id, created_at, updated_at, ...updates } = profile;
      void id; void user_id; void created_at; void updated_at;
      await updateProfile(user.id, updates as Partial<BusinessProfile>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    const url = await uploadAvatar(user.id, file);
    setProfile((prev) => prev ? { ...prev, avatar_url: url } as BusinessProfile : prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" message="Loading settings..." centered />
      </div>
    );
  }

  const initials = profile?.first_name
    ? `${profile.first_name.charAt(0)}${profile.last_name?.charAt(0) || ""}`
    : user?.email?.charAt(0) || "?";

  const directors = Array.isArray(profile?.directors) ? profile.directors as string[] : [];

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile and company details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="h-[40px] px-5 bg-magenta text-white font-bold text-sm rounded-lg hover:bg-magenta-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            "Saving..."
          ) : saved ? (
            <>
              <AppIcon name="check" className="w-4 h-4" />
              Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Personal Details */}
        <SettingsCard title="Personal Details" description="Your name and contact information">
          <div className="flex flex-col sm:flex-row gap-6">
            <AvatarUpload
              currentUrl={profile?.avatar_url}
              initials={initials}
              onUpload={handleAvatarUpload}
              className="sm:shrink-0"
            />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingsField
                label="First name"
                value={profile?.first_name || ""}
                onChange={(v) => handleUpdate("first_name", v)}
                placeholder="Sarah"
              />
              <SettingsField
                label="Last name"
                value={profile?.last_name || ""}
                onChange={(v) => handleUpdate("last_name", v)}
                placeholder="Thompson"
              />
              <SettingsField
                label="Email address"
                value={user?.email || ""}
                onChange={() => {}}
                type="email"
                disabled
              />
              <SettingsField
                label="Job title"
                value={profile?.job_title || ""}
                onChange={(v) => handleUpdate("job_title", v)}
                placeholder="Owner"
              />
              <SettingsField
                label="Phone"
                value={profile?.phone || ""}
                onChange={(v) => handleUpdate("phone", v)}
                type="tel"
                placeholder="07700 123456"
              />
              <SettingsField
                label="Website"
                value={profile?.website || ""}
                onChange={(v) => handleUpdate("website", v)}
                type="url"
                placeholder="www.mybusiness.co.uk"
              />
            </div>
          </div>
        </SettingsCard>

        {/* Company Information */}
        <SettingsCard title="Company Information" description="Your business registration details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsField
              label="Company name"
              value={profile?.company_name || ""}
              onChange={(v) => handleUpdate("company_name", v)}
              placeholder="My Business Ltd"
              className="sm:col-span-2"
            />
            <SettingsField
              label="Business structure"
              value={BUSINESS_TYPE_LABELS[profile?.business_type || ""] || ""}
              onChange={() => {}}
              disabled
            />
            <SettingsField
              label="Industry sector"
              value={profile?.sector || ""}
              onChange={(v) => handleUpdate("sector", v)}
              placeholder="Professional services"
            />
            {profile?.business_type === "limited_company" && (
              <>
                <SettingsField
                  label="Company number"
                  value={profile?.company_number || ""}
                  onChange={(v) => handleUpdate("company_number", v)}
                  placeholder="12345678"
                />
                <SettingsField
                  label="Date incorporated"
                  value={profile?.date_incorporated || ""}
                  onChange={(v) => handleUpdate("date_incorporated", v)}
                  type="date"
                />
              </>
            )}
            <SettingsField
              label="Number of employees"
              value={String(profile?.headcount || 1)}
              onChange={(v) => handleUpdate("headcount", parseInt(v) || 1)}
              type="number"
            />
            <SettingsField
              label="Trading since"
              value={profile?.trading_start_date || ""}
              onChange={(v) => handleUpdate("trading_start_date", v)}
              type="date"
            />
          </div>
        </SettingsCard>

        {/* VAT Details */}
        <SettingsCard title="VAT Registration">
          <div className="space-y-4">
            <SettingsToggle
              label="VAT registered"
              description="Toggle on if your business is registered for VAT with HMRC"
              checked={profile?.vat_registered || false}
              onChange={(v) => handleUpdate("vat_registered", v)}
            />
            {profile?.vat_registered && (
              <SettingsField
                label="VAT number"
                value={profile?.vat_number || ""}
                onChange={(v) => handleUpdate("vat_number", v)}
                placeholder="GB 123 4567 89"
              />
            )}
          </div>
        </SettingsCard>

        {/* Registered Address */}
        <SettingsCard title="Registered Address" description="Your official business address">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsField
              label="Address line 1"
              value={profile?.address_line_1 || ""}
              onChange={(v) => handleUpdate("address_line_1", v)}
              placeholder="123 High Street"
              className="sm:col-span-2"
            />
            <SettingsField
              label="Address line 2"
              value={profile?.address_line_2 || ""}
              onChange={(v) => handleUpdate("address_line_2", v)}
              placeholder="Suite 4"
              className="sm:col-span-2"
            />
            <SettingsField
              label="City"
              value={profile?.city || ""}
              onChange={(v) => handleUpdate("city", v)}
              placeholder="London"
            />
            <SettingsField
              label="Postcode"
              value={profile?.postcode || ""}
              onChange={(v) => handleUpdate("postcode", v)}
              placeholder="SW1A 1AA"
            />
          </div>
        </SettingsCard>

        {/* Directors (Ltd company only) */}
        {profile?.business_type === "limited_company" && (
          <SettingsCard title="Company Directors" description="People registered as directors at Companies House">
            <div className="space-y-3">
              {directors.map((director, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SettingsField
                    label={i === 0 ? "Director name" : ""}
                    value={String(director)}
                    onChange={(v) => {
                      const updated = [...directors];
                      updated[i] = v;
                      handleUpdate("directors", updated as unknown as string);
                    }}
                    placeholder="Full name"
                    className="flex-1"
                  />
                  <button
                    onClick={() => {
                      const updated = directors.filter((_, idx) => idx !== i);
                      handleUpdate("directors", updated as unknown as string);
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors mt-auto pb-2"
                  >
                    <AppIcon name="x" className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  handleUpdate("directors", [...directors, ""] as unknown as string);
                }}
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <AppIcon name="plus" className="w-4 h-4" />
                Add director
              </button>
            </div>
          </SettingsCard>
        )}
      </div>
    </div>
  );
}
