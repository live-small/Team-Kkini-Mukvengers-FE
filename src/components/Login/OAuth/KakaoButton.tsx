import { Flex, Text } from '@chakra-ui/react';
import Button from 'components/common/Button';
import { ImBubble } from 'react-icons/im';

const KakaoButton = () => {
  return (
    <a
      href={`http://3.35.95.125:8080/oauth2/authorization/kakao?redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL}`}>
      <Button
        style={{
          color: 'black',
          backgroundColor: '#FEE500',
          fontWeight: 600,
        }}>
        <Flex alignItems='center'>
          <ImBubble style={{ marginRight: '10px' }} />
          <Text>카카오 계정으로 로그인</Text>
        </Flex>
      </Button>
    </a>
  );
};

export default KakaoButton;
