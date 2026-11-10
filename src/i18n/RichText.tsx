import type { ReactNode } from "react";

const TAGS: Record<string, "strong" | "em"> = {
  strong: "strong",
  em: "em",
};

function parse(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /<(strong|em)>(.*?)<\/\1>/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(text))) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const Tag = TAGS[match[1]];
    if (Tag) {
      nodes.push(<Tag key={i}>{match[2]}</Tag>);
    } else {
      nodes.push(match[0]);
    }
    i += 1;
    last = match.index + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({
  text,
  as: Comp = "span",
  className,
}: {
  text: string;
  as?: "span" | "p" | "div";
  className?: string;
}) {
  return <Comp className={className}>{parse(text)}</Comp>;
}
