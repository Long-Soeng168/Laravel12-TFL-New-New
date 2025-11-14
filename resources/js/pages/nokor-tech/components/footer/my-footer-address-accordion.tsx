import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

// components/AccordionAdreesComponent.tsx
interface Detail {
  label: string;
  content: React.ReactNode; // Ensure content can be JSX
}

interface AccordionSection {
  title: string;
  details: Detail[];
}

interface AccordionAdreesComponentProps {
  data: AccordionSection[]; // Ensure this is consistent with the data being passed
}

const AccordionAdreesComponent: React.FC<AccordionAdreesComponentProps> = ({ data }) => {
  return (
    <Accordion type="single" collapsible>
      {data.map((section, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className='underline text-sm md:text-xl font-semibold text-gray-400'>{section.title}</AccordionTrigger>
          <AccordionContent>
            <ul className='mx-4 my-2 md:py-2 text-xs md:text-sm flex flex-col gap-2 text-gray-300'>
              {section.details.map((detail, idx) => (
                <li key={idx}>
                  <div className="font-medium">{detail.label}:</div>
                  <div>{detail.content}</div> {/* Directly render the content (which may be JSX) */}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionAdreesComponent;
