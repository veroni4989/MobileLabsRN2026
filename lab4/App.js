import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, TextInput, Alert, ScrollView, SafeAreaView,
  ActivityIndicator, Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const formatDate = (ts) => {
  if (!ts) return 'Невідомо';
  return new Date(ts * 1000).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const getExt = (name) => {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

const getIcon = (item) => {
  if (item.isDirectory) return 'DIR';
  const ext = getExt(item.name);
  const map = { txt: 'TXT', json: 'JSON', js: 'JS', md: 'MD', jpg: 'IMG', jpeg: 'IMG', png: 'IMG' };
  return map[ext] || 'FILE';
};

const ROOT = FileSystem.documentDirectory || '';

export default function App() {
  const [currentPath, setCurrentPath] = useState(ROOT);
  const [history,     setHistory]     = useState([]);
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [totalDisk,   setTotalDisk]   = useState(null);
  const [freeDisk,    setFreeDisk]    = useState(null);

  const [view,           setView]           = useState('browser');
  const [editingFile,    setEditingFile]    = useState(null);
  const [editorContent,  setEditorContent]  = useState('');
  const [editorDirty,    setEditorDirty]    = useState(false);

  const [modalFolder, setModalFolder] = useState(false);
  const [modalFile,   setModalFile]   = useState(false);
  const [modalInfo,   setModalInfo]   = useState(false);

  const [folderName,   setFolderName]   = useState('');
  const [fileName,     setFileName]     = useState('');
  const [fileContent,  setFileContent]  = useState('');
  const [fileInfo,     setFileInfo]     = useState(null);

  const loadDir = useCallback(async (path) => {
    setLoading(true);
    try {
      const names = await FileSystem.readDirectoryAsync(path);
      const rows = await Promise.all(
        names.map(async (name) => {
          const full = path + name;
          const info = await FileSystem.getInfoAsync(full);
          return { name, path: full, isDirectory: info.isDirectory, size: info.size, modificationTime: info.modificationTime };
        })
      );
      rows.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setItems(rows);
    } catch (e) {
      setItems([]);
    }
    setLoading(false);
  }, []);

  const loadStorage = useCallback(async () => {
    if (Platform.OS === 'web') return;
    try {
      const [total, free] = await Promise.all([
        FileSystem.getTotalDiskCapacityAsync(),
        FileSystem.getFreeDiskStorageAsync(),
      ]);
      setTotalDisk(total);
      setFreeDisk(free);
    } catch (_) {
  // Storage stats недоступні на цій платформі
}
  }, []);

useEffect(() => { loadDir(currentPath); loadStorage(); }, [currentPath, loadDir, loadStorage]);

  const goInto = (item) => {
    if (!item.isDirectory) return;
    setHistory(h => [...h, currentPath]);
    setCurrentPath(item.path + '/');
  };

  const goUp = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCurrentPath(prev);
  };

  const breadcrumb = () => {
    const rel = currentPath.replace(ROOT, '');
    return rel ? 'Documents/' + rel : 'Documents';
  };

  const openFile = async (item) => {
    const ext = getExt(item.name);
    if (ext !== 'txt') {
      Alert.alert('Увага', 'Можна відкривати лише .txt файли.');
      return;
    }
    try {
      const text = await FileSystem.readAsStringAsync(item.path);
      setEditingFile(item);
      setEditorContent(text);
      setEditorDirty(false);
      setView('editor');
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося відкрити файл.');
    }
  };

  const saveFile = async () => {
    try {
      await FileSystem.writeAsStringAsync(editingFile.path, editorContent);
      setEditorDirty(false);
      Alert.alert('Збережено', 'Файл успішно збережено.');
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зберегти файл.');
    }
  };

  const closeEditor = () => {
    const close = () => { setView('browser'); setEditingFile(null); loadDir(currentPath); };
    if (editorDirty) {
      Alert.alert('Незбережені зміни', 'Скасувати зміни та вийти?', [
        { text: 'Ні', style: 'cancel' },
        { text: 'Так', style: 'destructive', onPress: close },
      ]);
    } else close();
  };

  const createFolder = async () => {
    const name = folderName.trim();
    if (!name) return;
    try {
      await FileSystem.makeDirectoryAsync(currentPath + name);
      setFolderName(''); setModalFolder(false);
      loadDir(currentPath);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося створити папку.');
    }
  };

  const createFile = async () => {
    let name = fileName.trim();
    if (!name) return;
    if (!name.endsWith('.txt')) name += '.txt';
    try {
      await FileSystem.writeAsStringAsync(currentPath + name, fileContent);
      setFileName(''); setFileContent(''); setModalFile(false);
      loadDir(currentPath);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося створити файл.');
    }
  };

  const showInfo = async (item) => {
    const info = await FileSystem.getInfoAsync(item.path);
    setFileInfo({
      name: item.name,
      type: item.isDirectory ? 'Директорія' : (getExt(item.name).toUpperCase() || 'Невідомо'),
      size: info.size,
      modificationTime: info.modificationTime,
      isDirectory: item.isDirectory,
    });
    setModalInfo(true);
  };

  const deleteItem = (item) => {
    Alert.alert(
      'Видалити',
      `Ви впевнені, що хочете видалити "${item.name}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', style: 'destructive', onPress: async () => {
          try {
            await FileSystem.deleteAsync(item.path, { idempotent: true });
            loadDir(currentPath);
          } catch (e) {
            Alert.alert('Помилка', 'Не вдалося видалити.');
          }
        }},
      ]
    );
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.item}
      onPress={() => item.isDirectory ? goInto(item) : openFile(item)}
      onLongPress={() => showInfo(item)}
      activeOpacity={0.7}
    >
      <View style={[s.iconBadge, { backgroundColor: item.isDirectory ? '#dbeafe' : '#f3f4f6' }]}>
        <Text style={[s.iconText, { color: item.isDirectory ? '#3b82f6' : '#6b7280' }]}>
          {getIcon(item)}
        </Text>
      </View>
      <View style={s.itemInfo}>
        <Text style={s.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.itemMeta}>
          {item.isDirectory ? 'Папка' : formatSize(item.size || 0)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => showInfo(item)} style={s.infoBtn}>
        <Text style={s.infoBtnText}>i</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(item)} style={s.delBtn}>
        <Text style={s.delBtnText}>X</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const usedDisk = totalDisk && freeDisk ? totalDisk - freeDisk : null;
  const usedPct  = totalDisk ? Math.min(Math.round((usedDisk / totalDisk) * 100), 100) : 0;

  if (view === 'editor') {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.editorBar}>
          <TouchableOpacity onPress={closeEditor} style={s.editorBackBtn}>
            <Text style={s.editorBackText}>Назад</Text>
          </TouchableOpacity>
          <Text style={s.editorTitle} numberOfLines={1}>{editingFile?.name}</Text>
          <TouchableOpacity onPress={saveFile} style={s.editorSaveBtn}>
            <Text style={s.editorSaveText}>Зберегти</Text>
          </TouchableOpacity>
        </View>
        {editorDirty && (
          <View style={s.dirtyBanner}>
            <Text style={s.dirtyText}>Є незбережені зміни</Text>
          </View>
        )}
        <TextInput
          style={s.editor}
          value={editorContent}
          onChangeText={(t) => { setEditorContent(t); setEditorDirty(true); }}
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Файл порожній..."
          placeholderTextColor="#9ca3af"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Заголовок */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Файловий менеджер</Text>
      </View>

      {/* Статистика пам'яті */}
      {totalDisk !== null && (
        <View style={s.storageBox}>
          <Text style={s.storageLabel}>ПАМ'ЯТЬ ПРИСТРОЮ</Text>
          <View style={s.storageRow}>
            {[
              { label: 'Всього', value: formatSize(totalDisk), color: '#111827' },
              { label: 'Вільно',  value: formatSize(freeDisk),  color: '#22c55e' },
              { label: 'Зайнято', value: formatSize(usedDisk),  color: '#f97316' },
            ].map(c => (
              <View key={c.label} style={s.storageCard}>
                <Text style={[s.storageVal, { color: c.color }]}>{c.value}</Text>
                <Text style={s.storageLbl}>{c.label}</Text>
              </View>
            ))}
          </View>
          <View style={s.bar}>
            <View style={[s.barFill, { width: `${usedPct}%` }]} />
          </View>
          <Text style={s.barLabel}>{usedPct}% використано</Text>
        </View>
      )}

      {/* Шлях + кнопка вгору */}
      <View style={s.pathRow}>
        {history.length > 0 && (
          <TouchableOpacity onPress={goUp} style={s.upBtn}>
            <Text style={s.upText}>Вгору</Text>
          </TouchableOpacity>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={s.pathText}>{breadcrumb()}</Text>
        </ScrollView>
      </View>

      {/* Список файлів */}
      {loading ? (
        <ActivityIndicator color="#3b82f6" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.path}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={s.emptyText}>Папка порожня. Натисніть + для створення.</Text>
          }
        />
      )}

      {/* Кнопки дій */}
      <View style={s.actions}>
        <TouchableOpacity style={s.actBtn} onPress={() => setModalFolder(true)}>
          <Text style={s.actBtnText}>+ Папка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actBtn, { backgroundColor: '#22c55e' }]} onPress={() => setModalFile(true)}>
          <Text style={s.actBtnText}>+ Файл .txt</Text>
        </TouchableOpacity>
      </View>

      {/* Модалка: Нова папка */}
      <Modal visible={modalFolder} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Нова папка</Text>
            <TextInput
              style={s.input} placeholder="Назва папки"
              value={folderName} onChangeText={setFolderName} autoFocus
            />
            <View style={s.modalRow}>
              <TouchableOpacity style={s.btnCancel} onPress={() => { setModalFolder(false); setFolderName(''); }}>
                <Text>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnOk} onPress={createFolder}>
                <Text style={{ color:'#fff', fontWeight:'700' }}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка: Новий файл */}
      <Modal visible={modalFile} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Новий текстовий файл</Text>
            <TextInput
              style={s.input} placeholder="Ім'я файлу (без .txt)"
              value={fileName} onChangeText={setFileName} autoFocus
            />
            <TextInput
              style={[s.input, { height: 90, textAlignVertical:'top' }]}
              placeholder="Початковий вміст (необов'язково)"
              value={fileContent} onChangeText={setFileContent} multiline
            />
            <View style={s.modalRow}>
              <TouchableOpacity style={s.btnCancel} onPress={() => { setModalFile(false); setFileName(''); setFileContent(''); }}>
                <Text>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnOk} onPress={createFile}>
                <Text style={{ color:'#fff', fontWeight:'700' }}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка: Інформація про файл */}
      <Modal visible={modalInfo} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Інформація</Text>
            {fileInfo && [
              ['Назва',     fileInfo.name],
              ['Тип',       fileInfo.type],
              ...(!fileInfo.isDirectory ? [['Розмір', formatSize(fileInfo.size || 0)]] : []),
              ['Змінено',   formatDate(fileInfo.modificationTime)],
            ].map(([k, v]) => (
              <View key={k} style={s.infoRow}>
                <Text style={s.infoKey}>{k}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
            <TouchableOpacity style={[s.btnOk, { marginTop: 12 }]} onPress={() => setModalInfo(false)}>
              <Text style={{ color:'#fff', fontWeight:'700', textAlign:'center' }}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f9fafb' },

  header:       { backgroundColor:'#fff', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#e5e7eb' },
  headerTitle:  { fontSize:18, fontWeight:'700', color:'#111827' },

  storageBox:   { margin:12, backgroundColor:'#fff', borderRadius:14, padding:14, borderWidth:1, borderColor:'#e5e7eb' },
  storageLabel: { fontSize:10, fontWeight:'800', letterSpacing:1.5, color:'#9ca3af', marginBottom:10 },
  storageRow:   { flexDirection:'row', gap:8 },
  storageCard:  { flex:1, alignItems:'center', backgroundColor:'#f9fafb', borderRadius:10, padding:10 },
  storageVal:   { fontSize:15, fontWeight:'bold' },
  storageLbl:   { fontSize:10, color:'#6b7280', marginTop:2 },
  bar:          { height:6, backgroundColor:'#e5e7eb', borderRadius:3, marginTop:10, overflow:'hidden' },
  barFill:      { height:'100%', backgroundColor:'#3b82f6', borderRadius:3 },
  barLabel:     { fontSize:11, color:'#6b7280', marginTop:4, textAlign:'right' },

  pathRow:      { flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingVertical:8, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#e5e7eb' },
  upBtn:        { backgroundColor:'#3b82f6', paddingHorizontal:10, paddingVertical:5, borderRadius:6, marginRight:8 },
  upText:       { color:'#fff', fontSize:12, fontWeight:'700' },
  pathText:     { fontSize:12, color:'#6b7280', paddingVertical:2 },

  item:         { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', paddingHorizontal:12, paddingVertical:11, borderBottomWidth:0.5, borderBottomColor:'#f3f4f6', gap:10 },
  iconBadge:    { width:44, height:36, borderRadius:8, justifyContent:'center', alignItems:'center' },
  iconText:     { fontSize:10, fontWeight:'800', letterSpacing:0.5 },
  itemInfo:     { flex:1 },
  itemName:     { fontSize:14, fontWeight:'600', color:'#111827' },
  itemMeta:     { fontSize:11, color:'#9ca3af', marginTop:1 },
  infoBtn:      { width:30, height:30, borderRadius:15, backgroundColor:'#eff6ff', justifyContent:'center', alignItems:'center' },
  infoBtnText:  { color:'#3b82f6', fontWeight:'800', fontSize:13 },
  delBtn:       { width:30, height:30, borderRadius:15, backgroundColor:'#fee2e2', justifyContent:'center', alignItems:'center' },
  delBtnText:   { color:'#dc2626', fontWeight:'800', fontSize:12 },

  emptyText:    { textAlign:'center', color:'#9ca3af', marginTop:48, fontSize:14 },

  actions:      { flexDirection:'row', gap:10, padding:12, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#e5e7eb' },
  actBtn:       { flex:1, backgroundColor:'#3b82f6', borderRadius:10, paddingVertical:13, alignItems:'center' },
  actBtnText:   { color:'#fff', fontWeight:'700', fontSize:14 },

  overlay:      { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', padding:20 },
  modal:        { backgroundColor:'#fff', borderRadius:16, padding:20, width:'100%', maxWidth:400 },
  modalTitle:   { fontSize:16, fontWeight:'700', color:'#111827', marginBottom:14 },
  input:        { borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, padding:10, fontSize:14, marginBottom:10, color:'#111827' },
  modalRow:     { flexDirection:'row', gap:8, marginTop:4 },
  btnCancel:    { flex:1, padding:12, alignItems:'center', borderRadius:8, borderWidth:1, borderColor:'#e5e7eb' },
  btnOk:        { flex:1, padding:12, alignItems:'center', borderRadius:8, backgroundColor:'#3b82f6' },

  infoRow:      { flexDirection:'row', paddingVertical:7, borderBottomWidth:0.5, borderBottomColor:'#f3f4f6' },
  infoKey:      { width:70, fontSize:13, color:'#6b7280', fontWeight:'600' },
  infoVal:      { flex:1, fontSize:13, color:'#111827' },

  editorBar:      { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', paddingHorizontal:12, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#e5e7eb' },
  editorBackBtn:  { paddingHorizontal:12, paddingVertical:6, backgroundColor:'#f3f4f6', borderRadius:8 },
  editorBackText: { fontSize:13, fontWeight:'600', color:'#374151' },
  editorTitle:    { flex:1, textAlign:'center', fontSize:13, fontWeight:'700', color:'#111827', marginHorizontal:6 },
  editorSaveBtn:  { paddingHorizontal:12, paddingVertical:6, backgroundColor:'#3b82f6', borderRadius:8 },
  editorSaveText: { fontSize:13, fontWeight:'600', color:'#fff' },
  dirtyBanner:    { backgroundColor:'#fef3c7', paddingHorizontal:16, paddingVertical:6, borderBottomWidth:1, borderBottomColor:'#fcd34d' },
  dirtyText:      { fontSize:12, color:'#92400e', fontWeight:'600' },
  editor:         { flex:1, padding:16, fontSize:14, color:'#111827', lineHeight:22, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', backgroundColor:'#fff' },
});