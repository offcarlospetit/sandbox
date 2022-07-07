import React, {useEffect} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store';
import {fetchUsers, selectAllUsers, useSetNpsMutation} from '../store/user';

const Users = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector((state: RootState) => state.users);
  const users = useSelector(selectAllUsers);
  const [SetNps, {isLoading, isError, isSuccess, data}] = useSetNpsMutation();

  useEffect(() => {
    // dispatch(fetchUsers() as any);
  }, []);

  if (loading || isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const pressed = () => {
    SetNps({
      appId: 'appid mio',
      appToken: 'appToken mio',
      interceptor: 'id interceptor mio',
    });
  };

  console.log(data);
  if (!data)
    return (
      <View>
        <Button title={'Set NPs'} onPress={pressed} />
      </View>
    );

  return (
    <View>
      <Button title={'Reload'} onPress={() => dispatch(fetchUsers() as any)} />
      <Button title={'Set NPs'} onPress={pressed} />
      {data.data.map((item: any) => {
        return (
          <View style={styles.container} key={item}>
            <View>
              <View style={styles.dataContainer}>
                <Text>{item}</Text>
              </View>
              <View style={styles.dataContainer}>
                <Text>{item}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  loader: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  dataContainer: {
    flexDirection: 'row',
  },
});
