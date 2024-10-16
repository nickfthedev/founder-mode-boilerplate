import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditProfileForm from "~/components/user/edit-profile-form";

export default async function ProfilePage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <EditProfileForm user={session.user} />
    </div>
  );
}
