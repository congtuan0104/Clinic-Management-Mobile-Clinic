import React from "react";
import { Box, HStack, Image, Pressable, Text, VStack } from "native-base";
import PropTypes from "prop-types";
import { appColor } from "../../theme";
type Props = {
  id: string;
  image: string;
  content: string;
  time: string;
  isRead: boolean;
};
const NotificationItem = ({ image, content, time, isRead, id }: Props) => {
  return (
    <Pressable onPress={() => {}}>
      <HStack
        backgroundColor="#DFDEFF"
        p={2}
        pl={6}
        space={6}
        alignItems="center"
        borderRadius={20}
        justifyContent="space-evenly"
      >
        <Box
          backgroundColor={appColor.backgroundPrimary}
          minW="2%"
          maxW="2%"
          height="90%"
          borderRadius={10}
        ></Box>
        <VStack minW="90%" maxW="90%">
          <Text textAlign="justify" color={appColor.textTitle} fontSize={14}>
            {content}
          </Text>
          <Text color="#70708c" fontSize={12}>
            {time}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
};
export default NotificationItem;
