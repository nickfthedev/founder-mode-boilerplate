import { cn } from "~/lib/utils";
import BackButton from "~/components/common/back-button";

export default function PageHead({
  title,
  description,
  button,
  className,
  backButton,
  children,
}: {
  title: string;
  description: string;
  button?: React.ReactNode;
  className?: string;
  backButton?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col justify-center gap-2", className)}>
      <div
        className={cn(
          "flex flex-row items-center",
          button ? "justify-between" : "justify-start",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          {backButton && <BackButton />}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {button}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
