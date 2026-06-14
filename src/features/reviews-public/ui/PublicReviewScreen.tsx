import React from "react";
import { Block, Button, Input, Text } from "../../../ui/primitives"
import { api } from "../../../services/ApiClient";

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

export function PublicReviewScreen({ token }: Props) {
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
      <Block frame="center">
        <Text variant="caption">Loading review form...</Text>
      </Block>
    );
  }

  if (error || !reviewForm) {
    return (
      <Block frame="center">
        <Text variant="h3">Review unavailable</Text>
        <Text variant="caption">{error ?? "The review link is unavailable."}</Text>
      </Block>
    );
  }

  const normalizedToken = String(token ?? "").trim();

  return (
    <Block paint="page">
      <Block pad="md">
        <Block>
          <Text variant="h2">{reviewForm.name}</Text>
          <Text variant="caption">{`Type: ${reviewForm.entityType}`}</Text>
          <Input value={displayName} onChangeText={setDisplayName} placeholder="Your name (optional)" />
          {reviewForm.fields.map((field) => (
            <Block key={field.id} space="sm">
              <Text variant="bodySm">{field.label}</Text>
              {field.type === "text" ? (
                <Input
                  value={answers[field.id]?.textValue ?? ""}
                  onChangeText={(value) =>
                    setAnswers((prev) => ({ ...prev, [field.id]: { optionIds: [], textValue: value } }))
                  }
                  placeholder={field.required ? "Required" : "Optional"}
                />
              ) : (
                <Block direction="horizontal" space="sm">
                  {(field.options ?? []).map((option) => {
                    const selected = (answers[field.id]?.optionIds ?? []).includes(option.id);
                    return (
                      <Button
                        key={option.id}
                        label={option.label}
                        variant={selected ? "primary" : "secondary"}
                        fullWidth={false}
                        size="sm"
                        onPress={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [field.id]: { optionIds: [option.id], textValue: undefined },
                          }))
                        }
                      />
                    );
                  })}
                </Block>
              )}
            </Block>
          ))}
          {error ? <Text variant="caption">{error}</Text> : null}
          {success ? <Text variant="caption">{success}</Text> : null}
          <Button label={saving ? "Submitting..." : "Submit Review"} onPress={submit} disabled={saving || !normalizedToken} />
        </Block>
      </Block>
    </Block>
  );
}
