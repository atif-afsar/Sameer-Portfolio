import ExpertiseSection from "../components/ExpertiseSection";
import { expertiseSections } from "../data/expertiseData";

const digitalData = expertiseSections.find((section) => section.id === "digital");

export default function DigitalMarketingSection(props) {
  return <ExpertiseSection {...digitalData} {...props} />;
}
