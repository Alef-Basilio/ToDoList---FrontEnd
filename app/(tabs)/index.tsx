import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [texto, setTexto] = useState('');
  const [lista, setLista] = useState<string[]>([]);
  type ItensMarcados = { [key: number]: boolean };

const [itensMarcados, setItensMarcados] = useState<ItensMarcados>(
  lista.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
);

  function deletar(indexParameter: number) {
    const listaFiltrada = lista.filter((_, index) => index !== indexParameter);
    setLista(listaFiltrada);
  }

  const marcar = (index: number) => {
    setItensMarcados((prevItensMarcados: { [key: number]: boolean }) => ({
      ...prevItensMarcados,
      [index]: true,
    }));
  };

  const desmarcar = (index: number) => {
    setItensMarcados((prevItensMarcados: { [key: number]: boolean }) => ({
      ...prevItensMarcados,
      [index]: false,
    }));
  };

  function pegarTexto(entradaTexto: string) {
    setTexto(entradaTexto);
  }

  function adcTexto() {
  const novoIndex = lista.length;
  setLista([...lista, texto]);
  setItensMarcados({ ...itensMarcados, [novoIndex]: false });
}

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TODO LIST</Text>
      <View style={styles.boxInput}>
        <TextInput style={styles.input} onChangeText={pegarTexto} placeholder='digite algo'></TextInput>
        <Button title='adicionar' onPress={adcTexto} />
      </View>
      <View style={styles.border}></View>
      <View style={styles.lista}>
        {lista.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listaRender} onPress={() => console.log(`Clicou no item ${index}`)}>
            <Text style={[styles.item, itensMarcados[index] ? styles.itemMarcado : null]}>{item}</Text>
            <Button title='marcar' onPress={() => marcar(index)} />
            <Button title='desmarcar' onPress={() => desmarcar(index)} />
            <Button title='remover' onPress={() => deletar(index)} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    width: '70%',
  },
  boxInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  border: {
    borderBottomWidth: 1,
    marginTop: 10,
  },
  lista: {
    marginLeft: 20,
    marginTop: 10,
  },
  listaRender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  item: {
    fontSize: 18,
  },
  itemMarcado: {
    backgroundColor: 'green',
  },
});