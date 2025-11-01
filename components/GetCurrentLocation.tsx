import { useLocation } from "@/lib/hooks/useLocation";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setCurrentCity } from "@/lib/stores/slices/citySlice";

export default ({ withAddress = true }: { withAddress?: boolean }) => {
  const dispatch = useAppDispatch();
  const { getLocation } = useLocation({
    withAddress,
  });
  useEffect(() => {
    async function fetchLocation() {
      const location = await getLocation();
      //   dispatch(setCurrentCity({
      //     label: location?.label,
      //     value: location?.value,
      //     coord: {
      //       longitude: location?.longitude,
      //       latitude: location?.latitude,
      //     },
      //   }));
    }
    fetchLocation();
  }, []);
  return null;
};
