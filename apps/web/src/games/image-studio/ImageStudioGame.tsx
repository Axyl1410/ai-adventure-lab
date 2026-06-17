import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { BuilderSidebar } from "./components/BuilderSidebar";
import { GenerateImageButton } from "./components/GenerateImageButton";
import { ImagePromptPreview } from "./components/ImagePromptPreview";
import { ImageShowcaseCanvas } from "./components/ImageShowcaseCanvas";
import { StudentGallerySection } from "./components/StudentGallerySection";
import { getBuddyStoryState } from "./storyPrompt";
import { useImageStudio } from "./useImageStudio";

export function ImageStudioGame() {
  const { t: tGames } = useTranslation("games");
  const { t: tContent } = useTranslation("gameContent");
  const { session } = useSession();
  const navigate = useNavigate();
  const studio = useImageStudio(session);

  function handleStory() {
    if (!studio.image) {
      return;
    }
    navigate("/games/buddy-bot", {
      state: getBuddyStoryState(tContent, studio.image.promptUsed),
    });
  }

  return (
    <GameShell
      instruction={tGames("imageStudio.instruction")}
      subtitle={tGames("imageStudio.subtitle")}
      title={tGames("imageStudio.title")}
    >
      <div className="flex-1 space-y-8 pr-0 sm:space-y-10 sm:pr-1">
        <section className="grid items-start gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
          <BuilderSidebar
            details={studio.details}
            onDetailsChange={studio.setDetails}
            onStyleChange={studio.setStyle}
            onThemeChange={studio.setTheme}
            style={studio.style}
            theme={studio.theme}
          />

          <aside className="flex flex-col space-y-4 lg:sticky lg:top-4">
            <ImagePromptPreview prompt={studio.prompt} />
            <GenerateImageButton
              loading={studio.loading}
              onGenerate={() => void studio.generate()}
            />
            <ImageShowcaseCanvas
              error={studio.error}
              image={studio.image}
              loading={studio.loading}
              onStory={handleStory}
              resultRef={studio.resultRef}
            />
          </aside>
        </section>

        {studio.gallery.length > 0 && (
          <StudentGallerySection gallery={studio.gallery} />
        )}
      </div>
    </GameShell>
  );
}
