import { useNavigate } from "react-router-dom";
import { useHoverBox } from "../context/HoverContext";

const ListMenu = ({ classStyle = "" }) => {
  const { setActiveBox } = useHoverBox();
  const navigate = useNavigate(); // ← navigation hook

  const handleClick = (boxName) => {
    setActiveBox(boxName);
    navigate("/home"); // ← go to home page
  };

  return (
    <div className={`flex ${classStyle.includes("flex-col") ? "space-y-6" : "space-x-6"} ${classStyle}`}>
      <button onClick={() => handleClick("about")}>
        <img src="/webimage/Rectangle1.png" alt="about iATER" className="w-full h-full object-cover" />
      </button>

      <button onClick={() => handleClick("project")}>
        <img src="/webimage/Rectangle2.png" alt="project" className="w-full h-full object-cover" />
      </button>

      <button onClick={() => handleClick("program")}>
        <img src="/webimage/Rectangle3.png" alt="Program" className="w-full h-full object-cover" />
      </button>

      <button onClick={() => navigate("/")}>
        <img src="/webimage/Rectangle4.png" alt="none" className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default ListMenu;
