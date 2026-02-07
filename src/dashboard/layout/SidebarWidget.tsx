import { Link } from "react-router-dom";
import { logo2 } from "../../assets/images";
export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <img src={logo2} alt="" />
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Institute of Advanced Technology Education & Research
      </p>
      <Link to={"/"}
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Purchase Plan
      </Link>
    </div>
  );
}
