import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import type { RoomStatus } from "../types";

function pathFor(status: RoomStatus | undefined) {
  if (!status) return "/";
  if (status === "waiting") return "/waiting";
  return "/game";
}

const RoomGuard = () => {
  const status = useGameStore((state) => state.room?.status);
  const { pathname } = useLocation();

  const expectedPath = pathFor(status);

  if (pathname !== expectedPath) {
    return <Navigate to={expectedPath} replace />;
  }

  return <Outlet />;
};

export default RoomGuard;
