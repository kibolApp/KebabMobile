import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';

const CustomCheckbox = ({label, isSelected, onToggle}) => (
  <TouchableOpacity className="flex-row items-center my-1" onPress={onToggle}>
    <View
      className={`w-5 h-5 border-2 border-gray-800 ${
        isSelected ? 'bg-custom-green' : 'bg-white'
      } rounded-sm mr-2`}
    />
    <Text>{label}</Text>
  </TouchableOpacity>
);

const FilterSection = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const toggleOption = option => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option],
    );
  };

  return (
    <View>
      <Text className="font-semibold mt-2">{title}</Text>
      {options.map(option => (
        <CustomCheckbox
          key={option}
          label={option}
          isSelected={selectedOptions.includes(option)}
          onToggle={() => toggleOption(option)}
        />
      ))}
    </View>
  );
};

const FilterKebabModal = ({
  showFilterModal,
  setShowFilterModal,
  filterStatus,
  setFilterStatus,
  filterMeat,
  setFilterMeat,
  filterSauces,
  setFilterSauces,
  filterCraft,
  setFilterCraft,
  filterPremises,
  setFilterPremises,
  filterChainstore,
  setFilterChainstore,
  meatOptions,
  sauceOptions,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilterModal}
      onRequestClose={() => setShowFilterModal(false)}>
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-white p-5 rounded-lg w-full max-w-md shadow-lg mt-[50px]">
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => setShowFilterModal(false)}>
            <Ionicons name="close" size={25} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold mb-4 text-center text-custom-green">
            Filtry
          </Text>

          <ScrollView className="mb-4">
            <Text className="font-semibold">Filtruj według:</Text>

            <Picker
              selectedValue={filterStatus}
              onValueChange={value => setFilterStatus(value)}>
              <Picker.Item label="Wszystkie" value="all" />
              <Picker.Item label="Otwarte" value="open" />
              <Picker.Item label="Zamknięte" value="closed" />
              <Picker.Item label="Planujące otwarcie" value="planned" />
            </Picker>

            <FilterSection
              title="Wybierz mięso:"
              options={meatOptions}
              selectedOptions={filterMeat}
              setSelectedOptions={setFilterMeat}
            />

            <FilterSection
              title="Wybierz sos:"
              options={sauceOptions}
              selectedOptions={filterSauces}
              setSelectedOptions={setFilterSauces}
            />

            <Picker
              selectedValue={filterCraft}
              onValueChange={value => setFilterCraft(value)}>
              <Picker.Item label="Kraftowy" value={1} />
              <Picker.Item label="Bez kraftowego" value={0} />
            </Picker>

            <Picker
              selectedValue={filterPremises}
              onValueChange={value => setFilterPremises(value)}>
              <Picker.Item label="W budynku" value={1} />
              <Picker.Item label="W budce" value={0} />
            </Picker>

            <Picker
              selectedValue={filterChainstore}
              onValueChange={value => setFilterChainstore(value)}>
              <Picker.Item label="Sieciowy" value={1} />
              <Picker.Item label="Bez sieciowego" value={0} />
            </Picker>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterKebabModal;
