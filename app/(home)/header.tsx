'use client'
import { useSelectedPage } from "./use-selected-page";

export const Header = ({props:{title, description}}: {props: {title: string, description: string}}) => {
  const selectedPage = useSelectedPage();
  return <div className="flex items-center">
    <h4 className="text-x w-1/2">找房</h4>
    <p className="text-sm text-gray-500 flex-1">{selectedPage}</p>
  </div>;
};
