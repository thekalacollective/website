import {
  ApplicationStatus,
  LocationCity,
  LocationState,
  Member,
  MembershipApplication,
  Service,
  SurveyResponse,
  Tag,
} from "@prisma/client";
import React, { createContext, Dispatch, ReactNode, useReducer } from "react";
import { trpc } from "../../utils/trpc";

export type MemberWithFullData = Member & {
  membershipApplication:
    | (MembershipApplication & {
        surveyResponse: SurveyResponse;
      })
    | null;
  services: Service[];
  tags: Tag[];
  responses: SurveyResponse[];
  location: LocationCity & {
    state: LocationState;
  };
};

const initialState = {
  selectedTab: "PENDING" as ApplicationStatus,
  selectedMember: null as MemberWithFullData | null,
  isMemberModalOpen: false,
};

export const AdminContext = createContext(initialState);
export const AdminDispatchContext = createContext<Dispatch<AdminAction>>(
  () => null
);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  return (
    <AdminContext.Provider value={state}>
      <AdminDispatchContext.Provider value={dispatch}>
        {children}
      </AdminDispatchContext.Provider>
    </AdminContext.Provider>
  );
};

export enum AdminActionTypes {
  SET_SELECTED_TAB = "SET_SELECTED_TAB",
  SET_SELECTED_MEMBER = "SET_SELECTED_MEMBER",
  APPROVE_MEMBER = "APPROVE_MEMBER",
  REJECT_MEMBER = "REJECT_MEMBER",
  BLOCK_MEMBER = "BLOCK_MEMBER",
  SET_IS_MEMBER_MODAL_OPEN = "SET_IS_MEMBER_MODAL_OPEN",
}

type AdminAction = {
  type: AdminActionTypes;
  payload: string | MemberWithFullData | boolean;
};

function adminReducer(state = initialState, action: AdminAction) {
  switch (action.type) {
    case AdminActionTypes.SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload as ApplicationStatus,
      };
    case AdminActionTypes.SET_SELECTED_MEMBER:
      return {
        ...state,
        selectedMember: action.payload as MemberWithFullData,
        isMemberModalOpen: true,
      };
    case AdminActionTypes.SET_IS_MEMBER_MODAL_OPEN:
      return {
        ...state,
        isMemberModalOpen: action.payload as boolean,
      };

    default:
      return state;
  }
}
