// components/AccordionComponent.tsx

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import Link from 'next/link';
interface LinkItem {
  label: string;
  href: string;
}

interface AccordionSection {
  title: string;
  links: LinkItem[];
}

interface AccordionComponentProps {
  data: AccordionSection[];
}

const AccordionComponent:React.FC<AccordionComponentProps> = ({ data }) => {
  return (
    <Accordion type="single" collapsible>
      {data.map((section, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className='underline text-sm md:text-xl font-semibold text-gray-400'>
            {section.title}
          </AccordionTrigger>
          <AccordionContent>
            <ul className='mx-4 my-2 md:py-2 text-xs md:text-sm flex flex-col gap-2 text-gray-300'>
              <hr />

              {section.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href}>
                    <div className="cursor-pointer hover:text-blue-500">{link.label}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
