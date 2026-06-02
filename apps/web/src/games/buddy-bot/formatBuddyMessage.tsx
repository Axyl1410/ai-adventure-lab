export function formatBuddyMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    let content = line.trim();
    if (!content) {
      return <div className="h-2" key={lineIdx} />;
    }

    const isListItem = content.startsWith("* ") || content.startsWith("- ");
    if (isListItem) {
      content = content.substring(2).trim();
    }

    const parts = content.split(/\*\*([^*]+)\*\*/gu);
    const parsedLine = parts.map((part, partIdx) => {
      if (partIdx % 2 === 1) {
        return (
          <strong className="font-extrabold text-purpleLab" key={partIdx}>
            {part}
          </strong>
        );
      }
      return part;
    });

    if (isListItem) {
      return (
        <div
          className="my-1 flex items-start gap-1.5 pl-2 text-ink"
          key={lineIdx}
        >
          <span className="text-skyLab">✨</span>
          <span className="flex-1">{parsedLine}</span>
        </div>
      );
    }

    return (
      <p className={lineIdx > 0 ? "mt-1.5" : ""} key={lineIdx}>
        {parsedLine}
      </p>
    );
  });
}
