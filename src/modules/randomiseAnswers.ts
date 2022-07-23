import { SelectMenuOptionBuilder } from "discord.js";

import { Verification } from "../database/models/Verification";

/**
 * Module to shuffle the answers.
 *
 * @param {Verification} config The server configuration.
 * @returns {SelectMenuOptionBuilder[]} The shuffled answers.
 */
export const randomiseAnswers = (
  config: Verification
): SelectMenuOptionBuilder[] => {
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
  return randomisedAnswers.map((el, i) =>
    new SelectMenuOptionBuilder()
      .setValue(el.value)
      .setDescription(el.description)
      .setLabel(String(i + 1))
  );
};
