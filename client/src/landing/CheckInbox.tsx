import React from "react";
import styled from "styled-components";
import { ReactComponent as MailEnvelope } from "../assets/mail.svg";
import Heading from "../components/Heading";
import Spacer from "../components/Spacer";
import Text from "../components/Text";
import theme from "../theme";

const CheckInbox = () => {
  return (
    <Container>
      <Content>
        <MailEnvelope fill={theme.colors.white} width="80px" height="80px" />
        <Heading>Check your inbox</Heading>

        <Spacer y amount={10} />

        <Text>
          We sent you an activation link. Make sure to check your spam folder
          too.
        </Text>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

export default CheckInbox;
