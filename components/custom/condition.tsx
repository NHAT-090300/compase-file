import React, { ReactNode } from "react";

interface Props {
  condition: boolean;
  Then: ReactNode;
  Else?: ReactNode;
}

export const If = ({ condition, Then, Else }: Props) => {
  if (condition) return Then;

  return Else;
};
