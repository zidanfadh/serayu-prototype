import Component from "@/components/home/table-dashboard";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ThemeSwitch } from "@/components/ui/theme-switch-button";

export default function dashboard() {
  return (
    <div>
      <div className="flex justify-center item-center">
        <h1 className="font-bold text-5xl mt-10">Dashboard</h1>
        <div className="flex justify-center items-center py-8">
    </div>
      </div>
    <div className="flex justify-center-safe item-center py-10 mx-10">
    <Component/>
    </div>
    </div>
  )
}