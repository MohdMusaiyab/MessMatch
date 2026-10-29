const RESERVED_DEMO_EMAILS = [
  "testcontractor@gmail.com",
  "testinstitution@gmail.com",
  "admin@messmatch.com",
];

export const isDemoAccount = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  const envContractor = (process.env.DEMO_CONTRACTOR_EMAIL || "").toLowerCase().trim();
  const envInstitution = (process.env.DEMO_INSTITUTION_EMAIL || "").toLowerCase().trim();

  return (
    RESERVED_DEMO_EMAILS.includes(normalized) ||
    (Boolean(envContractor) && normalized === envContractor) ||
    (Boolean(envInstitution) && normalized === envInstitution)
  );
};

