import React, { useState, useEffect } from "react";

export default function TypingEffect({ text, speed = 150, pause = 1000 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!deleting && index < text.length) {
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, index + 1));
        setIndex(index + 1);
      }, speed);
    } else if (!deleting && index === text.length) {
      // Pause at full text before deleting
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && index > 0) {
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, index - 1));
        setIndex(index - 1);
      }, speed / 2);
    } else if (deleting && index === 0) {
      setDeleting(false);
    }

    return () => clearTimeout(timer);
  }, [index, deleting, text, speed, pause]);

  return <span>{displayedText}|</span>;
}
