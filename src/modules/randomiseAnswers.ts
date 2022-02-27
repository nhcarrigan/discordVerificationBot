import { MessageSelectOptionData } from "discord.js";

import { Verification } from "../database/models/Verification";

/**
 * Module to shuffle the answers.
 *
 * @param {Verification} config The server configuration.
 * @returns {MessageSelectOptionData[]} The shuffled answers.
 */
export const randomiseAnswers = (
  config: Verification
): MessageSelectOptionData[] => {
  const answers = [
    {
      description: config.answerOne,
      value: "one",
    },
    {
      description: config.answerTwo,
      value: "two",
    },
    {
      description: config.answerThree,
      value: "three",
    },
  ];

  const randomisedAnswers = [...answers].sort(() => Math.random() - 0.5);
  return randomisedAnswers.map((el, i) => ({ label: String(i + 1), ...el }));
};
