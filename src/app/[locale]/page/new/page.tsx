import NewPageForm from "~/components/page/new-page-form";
import { getServerAuthSession } from "~/server/auth";
import { canCreatePages } from "~/types/page.types";

export default async function NewPage() {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  if (!canCreatePages({ user: session.user })) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <NewPageForm userRole={session.user?.userRole} />
    </div>
  );
}
