'use client';
import { StaticPagesApi } from "@/api/static";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * 
 * @param {{onChange: (value: import("@/types/CourseFilter").CourseFilter)=>void}} param0 
 * @returns 
 */
export default function CoursesFilter({ onChange }) {

    const pathname = usePathname();
    const params = useSearchParams();
    const { replace } = useRouter();
    /**
     * @type {[import("@/types/static/global").Category[], (value: import("@/types/static/global").Category[]) => void]}
     */
    const [categories, setCategories] = useState([]);

    const levels = ["Beginner", "Intermediate", "Advanced"];
    /** * @type {import("@/types/CourseFilter").CourseFilter} */
    const defaultFilter = {
        categoryId: params.get("categoryId"),
        level: params.get("level") || levels[0],
        search: params.get("search") || ""
    }


    // the filter control state, it's will be 3 variables to success use jsDoc
    const filterState = useState(defaultFilter);

    /** * @type {import("@/types/CourseFilter").CourseFilter} */
    const filterData = filterState[0];

    /** * @type {(value: import("@/types/CourseFilter").CourseFilter) => void} */
    const setFilterData = filterState[1];

    const changeCategory = (value) => {
        setFilterData({
            ...filterData,
            category: value,
        });
    }

    // here we update the url path after every change to make the filter data shared with all page components
    useEffect(() => {
        const newParams = new URLSearchParams(params);
        if (filterData.category) newParams.set("categoryId", filterData.category);
        if (filterData.search) newParams.set("search", filterData.search);
        if (filterData.level) newParams.set("level", filterData.level);
        replace(`${pathname}?${newParams}`)
    }, [filterData]);

    useEffect(() => {
        StaticPagesApi.getCategories().then(setCategories);
    }, []);


    return (
        <div className="sticky h-fit top-0 left-0 w-full p-7 border border-[#F0F4F9] flex flex-col gap-8">
            <section className="flex flex-col gap-4 [&_input]:min-h-11">
                <h1 className="text-3xl">Search</h1>
                <div className="flex gap-3 items-center justify-center h-11">
                    <Input placeholder="Search Here  ..." className="h-full" value={filterData.search} onChange={(e) => setFilterData({ ...filterData, search: e.target.value })} />
                    <div className="bg-[#0D45C5] p-3 rounded-md text-white cursor-pointer hover:bg-[#4d74ce] transition-colors"><Search /></div>
                </div>
            </section>

            <section className="flex flex-col gap-4 [&_input]:min-h-11">
                <h1 className="text-3xl">Category</h1>
                <div className="flex flex-col gap-3 items-center justify-center">
                    <select value={filterData.category || null} className="w-full p-4 border-[#F0F4F9] border-2" onChange={e => changeCategory(e.target.value)}>
                        {
                            categories.map(category => (
                                <option key={category.id} value={category.id} title={category.description}>{category.name}</option>
                            ))
                        }
                    </select>

                    {/* <select value={filterData.categories[1]} className="w-full p-4 border-[#F0F4F9] border-2" onChange={e => changeCategory(1, e.target.value)}>
                        <option value="sharia">Sharia sciences</option>
                        <option value="arabic">arabic</option>
                        <option value="english">english</option>
                    </select> */}
                </div>
            </section>

            <section className="flex flex-col gap-4 [&_input]:min-h-11">
                <h1 className="text-3xl">Level</h1>
                <div className="flex flex-col gap-3 items-center justify-center">
                    {levels.map((level, i) => (
                        <div key={i} onClick={() => setFilterData({ ...filterData, level })} className={"w-full p-4 border-2 hover:shadow-md transition-all cursor-help " + (level == filterData.level ? "border-sky-600" : "border-[#F0F4F9]")}>{level}</div>
                    ))}
                </div>
            </section>
        </div>
    )
}