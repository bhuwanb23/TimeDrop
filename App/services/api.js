import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#10B981', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748B' },
  button: { backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#EF4444', fontSize: 12 },
});

export default styles;