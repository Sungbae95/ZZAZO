import React from "react";
import styled from "styled-components";
import InterestsListItem from "../../auth/signup/InterestsListItem";
import { PlanHeaderWrapper } from "../../styled/Wrapper";
import { CATEGORIES } from "./../../../constants/PlaceCategories";

const CategoriesBody = styled.div`
  display: grid;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  place-items: center;
  min-height: 100%;
  padding-top: 0.3rem;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
`;

const ListHeader = ({ onHandleCategoryClick }) => {
  return (
    <PlanHeaderWrapper flexDirection="column" height="120px">
      <CategoriesBody>
        {CATEGORIES.map((item, index) => (
          <InterestsListItem
            categoryName={item}
            key={index}
            height="32px"
            fontSize="0.8rem"
            onHandleInterestClick={onHandleCategoryClick}
          />
        ))}
      </CategoriesBody>
    </PlanHeaderWrapper>
  );
};

export default ListHeader;
