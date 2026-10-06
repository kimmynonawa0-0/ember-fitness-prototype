import { StyleSheet } from 'react-native';

// Flexbox places the exercise details and Delete button in one row.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  brand: {
    color: '#f07842',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 15,
    marginTop: 6,
  },
  form: {
    backgroundColor: '#1d1d1f',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 10,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#101010',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#f07842',
    alignItems: 'center',
    padding: 13,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: '#ffffff',
    marginTop: 10,
  },
  pageContent: {
    flex: 1,
  },
  history: {
    flex: 1,
  },
  listTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  list: {
    padding: 20,
  },
  emptyText: {
    color: '#aaaaaa',
    fontSize: 15,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d1d1f',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  workoutDetails: {
    flex: 1,
  },
  exerciseName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  repText: {
    color: '#aaaaaa',
    marginTop: 4,
  },
  deleteText: {
    color: '#f07842',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#444444',
    paddingVertical: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  homeIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  homeBody: {
    width: 18,
    height: 12,
    marginTop: -1,
  },
  activeRoof: {
    borderBottomColor: '#f07842',
  },
  inactiveRoof: {
    borderBottomColor: '#aaaaaa',
  },
  activeIcon: {
    backgroundColor: '#f07842',
  },
  inactiveIcon: {
    backgroundColor: '#aaaaaa',
  },
  clockIcon: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderRadius: 13,
  },
  activeClock: {
    borderColor: '#f07842',
  },
  inactiveClock: {
    borderColor: '#aaaaaa',
  },
  clockHandTop: {
    position: 'absolute',
    width: 2,
    height: 8,
    top: 4,
    left: 10,
  },
  clockHandSide: {
    position: 'absolute',
    width: 7,
    height: 2,
    top: 11,
    left: 10,
  },
});

export default styles;
