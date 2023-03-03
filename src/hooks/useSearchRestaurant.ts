import { useRecoilValue, useSetRecoilState } from 'recoil';
import { kakaoMapOptionsState } from 'stores/kakaoMap';
import { searchRestaurantListState } from 'stores/Restaurant';
import { AxiosPhotoResponseValue } from 'types/kakaoSearch';
import { keywordSearch } from 'utils/helpers/kakaoMap';
import { getKeywordPhotos } from 'utils/helpers/kakaoSearch';

const useSearchRestaurant = () => {
  const kakaoMapOptions = useRecoilValue(kakaoMapOptionsState);
  const kakaoPlaces = new kakao.maps.services.Places();
  const setRestaurantList = useSetRecoilState(searchRestaurantListState);

  const searchByKeyword = async (keyword: string) => {
    const { lng, lat } = kakaoMapOptions.center;

    const options = {
      category_group_code: 'FD6',
      x: lng,
      y: lat,
      radius: 1000,
    };

    const keywordSearchResult: kakao.maps.services.PlacesSearchResult =
      await keywordSearch(kakaoPlaces, keyword, options).then((result) => result);

    console.log(keywordSearchResult[0]);
    const getPhotoPromises = keywordSearchResult.map(
      async ({ address_name, place_name }) => {
        return await getKeywordPhotos(address_name, place_name);
      }
    );

    const photoData = await Promise.allSettled(getPhotoPromises);
    const photoList = photoData.reduce<AxiosPhotoResponseValue[]>((prev, result) => {
      if (result.status === 'fulfilled') {
        prev.push(result.value);
      }
      return prev;
    }, []);

    const photos = photoList.map(({ documents }) => {
      return documents.map(({ image_url }) => image_url);
    });
    console.log(photos);

    const searchResult = keywordSearchResult.map((item, i) => {
      const {
        place_name: placeName,
        category_name: categoryName,
        road_address_name: roadAddressName,
        place_url: kakaoPlaceUrl,
        phone: phoneNumber,
        x,
        y,
      } = item;

      const categories = categoryName.split('>').map((category) => category.trim());

      return {
        placeName,
        categories,
        roadAddressName,
        photoUrls: photos[i],
        kakaoPlaceUrl,
        phoneNumber,
        x: parseFloat(x),
        y: parseFloat(y),
      };
    });

    setRestaurantList(searchResult);
  };

  return { searchByKeyword };
};

export default useSearchRestaurant;
