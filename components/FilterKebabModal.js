import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons';

const CustomCheckbox = ({label, isSelected, onToggle}) => (
  <TouchableOpacity className="flex-row items-center my-1" onPress={onToggle}>
    <View
      className={`w-5 h-5 border-2 border-gray-800 ${
        isSelected ? 'bg-blue-500' : 'bg-white'
      } rounded-sm mr-2`}
    />
    <Text>{label}</Text>
  </TouchableOpacity>
);

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
          <Text className="text-xl font-bold mb-4 text-center text-custom-green">Filtry</Text>

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

            <View>
              <Text className="font-semibold mt-2">Wybierz mięso:</Text>
              <CustomCheckbox
                label="Kurczak"
                isSelected={filterMeat.includes('kurczak')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('kurczak')
                      ? prev.filter(item => item !== 'kurczak')
                      : [...prev, 'kurczak'],
                  )
                }
              />
              <CustomCheckbox
                label="Wieprzowina"
                isSelected={filterMeat.includes('wieprzowina')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('wieprzowina')
                      ? prev.filter(item => item !== 'wieprzowina')
                      : [...prev, 'wieprzowina'],
                  )
                }
              />
              <CustomCheckbox
                label="Turecki"
                isSelected={filterMeat.includes('turecki')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('turecki')
                      ? prev.filter(item => item !== 'turecki')
                      : [...prev, 'turecki'],
                  )
                }
              />
              <CustomCheckbox
                label="Jogurtowy"
                isSelected={filterMeat.includes('jogurtowy')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('jogurtowy')
                      ? prev.filter(item => item !== 'jogurtowy')
                      : [...prev, 'jogurtowy'],
                  )
                }
              />
              <CustomCheckbox
                label="Mieszane"
                isSelected={filterMeat.includes('mieszane')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('mieszane')
                      ? prev.filter(item => item !== 'mieszane')
                      : [...prev, 'mieszane'],
                  )
                }
              />
              <CustomCheckbox
                label="Falafel"
                isSelected={filterMeat.includes('falafel')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('falafel')
                      ? prev.filter(item => item !== 'falafel')
                      : [...prev, 'falafel'],
                  )
                }
              />
              <CustomCheckbox
                label="Kapsalon"
                isSelected={filterMeat.includes('kapsalon')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('kapsalon')
                      ? prev.filter(item => item !== 'kapsalon')
                      : [...prev, 'kapsalon'],
                  )
                }
              />
              <CustomCheckbox
                label="Baran"
                isSelected={filterMeat.includes('baran')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('baran')
                      ? prev.filter(item => item !== 'baran')
                      : [...prev, 'baran'],
                  )
                }
              />
              <CustomCheckbox
                label="Wołowina"
                isSelected={filterMeat.includes('wołowina')}
                onToggle={() =>
                  setFilterMeat(prev =>
                    prev.includes('wołowina')
                      ? prev.filter(item => item !== 'wołowina')
                      : [...prev, 'wołowina'],
                  )
                }
              />
            </View>

            <View>
              <Text className="font-semibold mt-2">Wybierz sos:</Text>
              <CustomCheckbox
                label="Łagodny"
                isSelected={filterSauces.includes('łagodny')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('łagodny')
                      ? prev.filter(item => item !== 'łagodny')
                      : [...prev, 'łagodny'],
                  )
                }
              />
              <CustomCheckbox
                label="Ostry"
                isSelected={filterSauces.includes('ostry')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('ostry')
                      ? prev.filter(item => item !== 'ostry')
                      : [...prev, 'ostry'],
                  )
                }
              />
              <CustomCheckbox
                label="Mieszany"
                isSelected={filterSauces.includes('mieszany')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('mieszany')
                      ? prev.filter(item => item !== 'mieszany')
                      : [...prev, 'mieszany'],
                  )
                }
              />
              <CustomCheckbox
                label="Czosnek"
                isSelected={filterSauces.includes('czosnek')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('czosnek')
                      ? prev.filter(item => item !== 'czosnek')
                      : [...prev, 'czosnek'],
                  )
                }
              />
              <CustomCheckbox
                label="Ziołowy"
                isSelected={filterSauces.includes('ziołowy')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('ziołowy')
                      ? prev.filter(item => item !== 'ziołowy')
                      : [...prev, 'ziołowy'],
                  )
                }
              />
              <CustomCheckbox
                label="BBQ"
                isSelected={filterSauces.includes('bbq')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('bbq')
                      ? prev.filter(item => item !== 'bbq')
                      : [...prev, 'bbq'],
                  )
                }
              />
              <CustomCheckbox
                label="Arabski"
                isSelected={filterSauces.includes('arabski')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('arabski')
                      ? prev.filter(item => item !== 'arabski')
                      : [...prev, 'arabski'],
                  )
                }
              />
              <CustomCheckbox
                label="Miętowy"
                isSelected={filterSauces.includes('miętowy')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('miętowy')
                      ? prev.filter(item => item !== 'miętowy')
                      : [...prev, 'miętowy'],
                  )
                }
              />
              <CustomCheckbox
                label="Musztardowy"
                isSelected={filterSauces.includes('musztardowy')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('musztardowy')
                      ? prev.filter(item => item !== 'musztardowy')
                      : [...prev, 'musztardowy'],
                  )
                }
              />
              <CustomCheckbox
                label="Czosnkowy"
                isSelected={filterSauces.includes('czosnkowy')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('czosnkowy')
                      ? prev.filter(item => item !== 'czosnkowy')
                      : [...prev, 'czosnkowy'],
                  )
                }
              />
              <CustomCheckbox
                label="Koperkowy"
                isSelected={filterSauces.includes('koperkowy')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('koperkowy')
                      ? prev.filter(item => item !== 'koperkowy')
                      : [...prev, 'koperkowy'],
                  )
                }
              />

              <CustomCheckbox
                label="Miodowo-Musztardowy"
                isSelected={filterSauces.includes('miodowo-musztardowy')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('miodowo-musztardowy')
                      ? prev.filter(item => item !== 'miodowo-musztardowy')
                      : [...prev, 'miodowo-musztardowy'],
                  )
                }
              />
              <CustomCheckbox
                label="Pikantny"
                isSelected={filterSauces.includes('pikantny')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('pikantny')
                      ? prev.filter(item => item !== 'pikantny')
                      : [...prev, 'pikantny'],
                  )
                }
              />
              <CustomCheckbox
                label="Ketchup"
                isSelected={filterSauces.includes('ketchup')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('ketchup')
                      ? prev.filter(item => item !== 'ketchup')
                      : [...prev, 'ketchup'],
                  )
                }
              />
              <CustomCheckbox
                label="Sriracha Mayo"
                isSelected={filterSauces.includes('sriracha mayo')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('sriracha mayo')
                      ? prev.filter(item => item !== 'sriracha mayo')
                      : [...prev, 'sriracha mayo'],
                  )
                }
              />
              <CustomCheckbox
                label="Salsa Verde"
                isSelected={filterSauces.includes('salsa verde')}
                onToggle={() =>
                  setFilterSauces(prev =>
                    prev.includes('salsa verde')
                      ? prev.filter(item => item !== 'salsa verde')
                      : [...prev, 'salsa verde'],
                  )
                }
              />
            </View>

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
