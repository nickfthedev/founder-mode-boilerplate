import PageHead from "~/components/common/page-head";
import NewStoryForm from "./new-story-form";
import { getServerAuthSession } from "~/server/auth";
import { canGenerateNewStories } from "../stories.types";

export default async function StoriesNewPage() {
  const session = await getServerAuthSession();
  if (!session?.user || !canGenerateNewStories(session.user)) {
    return <div>You are not authorized to generate new stories</div>;
  }

  return (
    <PageHead
      title="New Story"
      description="Create new stories with a few sentences. Our advanced AI will then start to work on it and generate a beautiful story with complete illustrations."
      backButton
    >
      <NewStoryForm />
    </PageHead>
  );
}
