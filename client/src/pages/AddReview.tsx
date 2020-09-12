import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { gql, useMutation, useQuery } from "@apollo/client";
import Portal from "../components/Portal";
import Sheet from "../components/Sheet";
import Search, { Item } from "../components/Search";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { GetTreat } from "../generated/GetTreat";
import { CreateReview } from "../generated/CreateReview";

const AddReview: React.FC = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<GetTreat>(GET_TREAT, {
    variables: { id: parseInt(id) },
  });

  const [createReview] = useMutation<CreateReview>(CREATE_REVIEW, {
    refetchQueries: ["GetTreat"],
  });
  const [selected, setSelected] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm<{
    score: string;
    review: string;
  }>();

  useEffect(() => setShowModal(false), [selected]);

  const onSubmit = handleSubmit(async ({ score, review }) => {
    console.log("review: ", review);
    console.log("score: ", score);
    console.log("id: ", id);

    try {
      const review2 = await createReview({
        variables: { treatId: parseInt(id), score: parseInt(score), review },
      });

      console.log("review: ", review2);
    } catch (error) {
      console.error(error);
    }
  });

  if (loading || !data) return null;

  const reviews = data.treat.reviews;

  return (
    <>
      <Container>
        <span>{data.treat.name}</span>
        <span>{data.treat.producedBy.name}</span>
        <Form onSubmit={onSubmit}>
          <HeaderInput
            placeholder="Insert review"
            name="review"
            ref={register({ required: true })}
          />
          <HeaderInput
            placeholder="Insert score"
            name="score"
            ref={register({ required: true })}
          />

          <Button type="submit" value="Submit" />
        </Form>

        <CardContainer>
          {reviews.map(({ id, score, review }: any) => (
            <Card key={`review-card-${id}`}>
              {review} {score}
            </Card>
          ))}
        </CardContainer>
      </Container>

      {showModal && (
        <Portal onClose={() => setShowModal(false)}>
          <Sheet onClose={() => setShowModal(false)}>
            <Search setSelected={setSelected} />
          </Sheet>
        </Portal>
      )}
    </>
  );
};

const Button = styled.input`
  border: none;
  outline: none;
  width: 100%;
  text-align: center;
  background-color: inherit;
  color: rgba(255, 255, 255, 0.847);
  border-top: solid 1px rgba(255, 255, 255, 0.247);
  border-bottom: solid 1px rgba(255, 255, 255, 0.247);
  padding: 8px;

  :hover {
    opacity: 0.8;
  }
`;

const HeaderInput = styled.input`
  background-color: inherit;
  color: rgba(255, 255, 255, 0.847);
  font-size: 38px;
  padding: 10px;
  border: none;
  outline: none;
  width: 100%;
  height: 80px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-gap: 10px;
`;

const Form = styled.form`
  display: grid;
  grid-gap: 20px;
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($treatId: Float!, $score: Float!, $review: String!) {
    createReview(treatId: $treatId, score: $score, review: $review) {
      id
    }
  }
`;

const GET_TREAT = gql`
  query GetTreat($id: Float!) {
    treat(id: $id) {
      id
      name
      producedBy {
        name
        id
      }
      reviews {
        id
        review
        score
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 800px;
  font-size: 28px;
  border-radius: 8px;

  @media (max-width: 800px) {
    width: calc(100vw);
  }
`;

export default AddReview;
