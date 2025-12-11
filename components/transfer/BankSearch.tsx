import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Bank, transferApi } from '@/utils/transferApi';
import { Search } from 'lucide-react-native';

interface Props {
  onSelect: (bank: Bank) => void;
  selectedBank?: Bank;
}

export default function BankSearch({ onSelect, selectedBank }: Props) {
  const [query, setQuery] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    setLoading(true);
    try {
      const data = await transferApi.getBanks();
      setBanks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanks = banks.filter(b => 
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (bank: Bank) => {
    onSelect(bank);
    setQuery(bank.name);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bank Name</Text>
      <View style={styles.inputContainer}>
        <Search size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search bank..."
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
      </View>

      {showDropdown && (
        <View style={styles.dropdown}>
          {loading ? (
            <ActivityIndicator style={{ padding: 20 }} />
          ) : (
            <FlatList
              data={filteredBanks}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                  <Image source={{ uri: item.logo }} style={styles.logo} />
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 200 }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, zIndex: 10 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: { width: 24, height: 24, borderRadius: 12, marginRight: 12 },
  itemText: { fontSize: 16, color: '#333' },
});
