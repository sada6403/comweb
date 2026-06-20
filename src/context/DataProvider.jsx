import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { DataContext } from "./DataContext";
import {
  DEMO_COMPANY,
  DEMO_SERVICES,
  DEMO_REVIEWS,
  DEMO_STATS,
  DEMO_FEATURES,
} from "../data/fallback";

/* Loads all public content once, then exposes it (with setters) so the admin
   dashboard can update the UI optimistically after a successful API write.
   Falls back to demo data when the backend is unavailable. */
export function DataProvider({ children }) {
  const [company, setCompany] = useState(DEMO_COMPANY);
  const [services, setServices] = useState(DEMO_SERVICES);
  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [stats, setStats] = useState(DEMO_STATS);
  const [features, setFeatures] = useState(DEMO_FEATURES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [svc, comp, rev, stt, ftr] = await Promise.all([
        api.list("services").catch(() => null),
        api.list("company").catch(() => null),
        api.list("reviews").catch(() => null),
        api.list("stats").catch(() => null),
        api.list("features").catch(() => null),
      ]);
      if (!active) return;
      if (svc?.length) setServices(svc);
      if (comp?.length) setCompany(comp[0]);
      if (rev?.length) setReviews(rev);
      if (stt?.length) setStats(stt);
      if (ftr?.length) setFeatures(ftr);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = {
    company, setCompany,
    services, setServices,
    reviews, setReviews,
    stats, setStats,
    features, setFeatures,
    loaded,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
