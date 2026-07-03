import React from "react";
import { Body, Button, Heading, Input, useUI, XStack, YStack } from "../../platform/ui/index";
import { api } from "../../platform/api/client";

interface Props {
  token?: string;
}

interface ReviewTemplateOption {
  id: string;
  label: string;
}

interface ReviewTemplateField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: ReviewTemplateOption[];
}

interface ReviewTemplate {
  id: string;
  version: number;
  entityType: string;
  name: string;
  fields: ReviewTemplateField[];
}

interface ReviewTemplateResponse {
  reviewForm: ReviewTemplate;
}

export function PublicReviewView({ token }: Props) {
  const { contracts } = useUI();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState<string>();
  const [displayName, setDisplayName] = React.useState("");
  const [reviewForm, setReviewForm] = React.useState<ReviewTemplate>();
  const [answers, setAnswers] = React.useState<Record<string, { optionIds: string[]; textValue?: string }>>({});

  React.useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(undefined);
      setSuccess(undefined);
      const normalizedToken = String(token ?? "").trim();
      const result = await api.get<ReviewTemplateResponse>(`/reviews/${encodeURIComponent(normalizedToken)}`);
      if (canceled) return;
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setReviewForm(result.data.reviewForm);
      setLoading(false);
    }
    void load();
    return () => {
      canceled = true;
    };
  }, [token]);

  async function submit() {
    if (!reviewForm) return;
    const normalizedToken = String(token ?? "").trim();
    setSaving(true);
    setError(undefined);
    setSuccess(undefined);
    const payload = {
      displayName: displayName.trim() || "Reviewer",
      reviewFormId: reviewForm.id,
      reviewFormVersion: reviewForm.version,
      answers: reviewForm.fields.map((field) => ({
        fieldId: field.id,
        optionIds: answers[field.id]?.optionIds ?? [],
        textValue: answers[field.id]?.textValue,
      })),
    };
    const result = await api.post(`/reviews/${encodeURIComponent(normalizedToken)}`, payload);
    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }
    setSaving(false);
    setSuccess("Review submitted.");
  }

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4">
        <Body fontSize="$2" color="$textMuted">Loading review form...</Body>
      </YStack>
    );
  }

  if (error || !reviewForm) {
    return (
      <YStack f={1} ai="center" jc="center" gap="$2" p="$4">
        <Heading>Review unavailable</Heading>
        <Body fontSize="$2" color="$textMuted">{error ?? "The review link is unavailable."}</Body>
      </YStack>
    );
  }

  const normalizedToken = String(token ?? "").trim();

  return (
    <YStack bg="$bg" f={1}>
      <YStack p="$4" gap="$4">
        <Heading>{reviewForm.name}</Heading>
        <Body fontSize="$2" color="$textMuted">{`Type: ${reviewForm.entityType}`}</Body>
          <Input contract={contracts.input!["default"]} value={displayName} onChangeText={setDisplayName} placeholder="Your name (optional)" />
          {reviewForm.fields.map((field) => (
            <YStack key={field.id} gap="$3">
              <Body fontSize="$2">{field.label}</Body>
              {field.type === "text" ? (
                <Input
                  contract={contracts.input!["default"]}
                  value={answers[field.id]?.textValue ?? ""}
                  onChangeText={(value) =>
                    setAnswers((prev) => ({ ...prev, [field.id]: { optionIds: [], textValue: value } }))
                  }
                  placeholder={field.required ? "Required" : "Optional"}
                />
              ) : (
                <XStack gap="$3" flexWrap="wrap">
                  {(field.options ?? []).map((option) => {
                    const selected = (answers[field.id]?.optionIds ?? []).includes(option.id);
                    return (
                      <Button
                        key={option.id}
                        contract={selected ? contracts.button!["primary"] : contracts.button!["secondary"]}
                        onPress={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [field.id]: { optionIds: [option.id], textValue: undefined },
                          }))
                        }
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </XStack>
              )}
            </YStack>
          ))}
          {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
          {success ? <Body fontSize="$2" color="$textMuted">{success}</Body> : null}
          <Button contract={contracts.button!["primary"]} onPress={submit} disabled={saving || !normalizedToken}>
            {saving ? "Submitting..." : "Submit Review"}
          </Button>
      </YStack>
    </YStack>
  );
}
