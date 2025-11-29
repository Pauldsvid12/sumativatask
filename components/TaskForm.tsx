import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Mic, Calendar, Clock, XCircle } from 'lucide-react-native';
import { useTheme } from '../lib/contexts/ThemeContext';
import { ValidationError } from '../lib/types/task';
import { validateTaskForm } from '../lib/utils/validation';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialStartDate?: string;
  initialDueDate?: string;
  onSubmit: (data: any) => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTitle = '',
  initialDescription = '',
  initialStartDate,
  initialDueDate,
  onSubmit,
  submitButtonText = 'Guardar',
  isLoading = false,
}) => {
  const { colors, theme } = useTheme();
  
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  
  //estados para fechas
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate ? new Date(initialStartDate) : undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDueDate ? new Date(initialDueDate) : undefined);
  
  //control de pickers
  //mode: 'date' | 'time' para controlar que selector se muestra
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [activeField, setActiveField] = useState<'start' | 'due' | null>(null);

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleVoiceInput = () => {
    alert("Para usar voz, presiona el icono de micrófono 🎙️ en tu teclado.");
  };

  //Manejador unificado de cambios de fecha
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setActiveField(null);
      return;
    }

    const currentDate = selectedDate || new Date();

    if (Platform.OS === 'android') {
      //primero seleccionamos fecha, luego hora
      if (pickerMode === 'date') {
        setPickerMode('time'); //Cambiar a modo hora para la siguiente renderizacion
        //Guardamos temporalmente la fecha y esperamos a que el usuario elija la hora
        //Pero como DateTimePicker se cierra al seleccionar necesitamos reabrirlo en modo time
        //Guardar la fecha seleccionada y abrir el picker de hora inmediatamente
        if (activeField === 'start') {
          setStartDate(currentDate);
        } else {
          setDueDate(currentDate);
        }
        //En Android el componente se desmonta, así que forzamos re-render con time
        //setTimeout ayuda a que el UI responda
      } else {
        //modo 'time': Ya tenemos fecha y hora
        if (activeField === 'start' && startDate) {
            const finalDate = new Date(startDate);
            finalDate.setHours(currentDate.getHours());
            finalDate.setMinutes(currentDate.getMinutes());
            setStartDate(finalDate);
        } else if (activeField === 'due' && dueDate) {
            const finalDate = new Date(dueDate);
            finalDate.setHours(currentDate.getHours());
            finalDate.setMinutes(currentDate.getMinutes());
            setDueDate(finalDate);
        } else if (activeField === 'start' && !startDate) {
             setStartDate(currentDate);
        } else if (activeField === 'due' && !dueDate) {
             setDueDate(currentDate);
        }
        
        setActiveField(null);
        setPickerMode('date');//Resetear a fecha para la próxima
      }
    } else {
      // iOS soporta datetime directamente
      if (activeField === 'start') setStartDate(currentDate);
      if (activeField === 'due') setDueDate(currentDate);
      //En iOS el picker no se cierra solo asi que podríamos mantenerlo o cerrarlo con un botón Listo
      //Aqui asumimos comportamiento estándar
    }
  };
  
  const showPicker = (field: 'start' | 'due') => {
      setActiveField(field);
      setPickerMode('date');//empezar pidiendo fecha
  };

  const handleSubmit = () => {
    const validationErrors = validateTaskForm(title, description);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const taskPayload = {
        title: title.trim(),
        description: description.trim(),
        startDate: startDate ? startDate.toISOString() : undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined
      };
      //enviamos el payload limpio
      onSubmit(taskPayload);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Seleccionar fecha y hora';
    return date.toLocaleString('es-ES', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const inputStyle = [
    styles.input, 
    { 
      backgroundColor: colors.inputBg, 
      color: colors.text, 
      borderColor: colors.border,
    }
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        
        {/* Título */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
            <TouchableOpacity onPress={handleVoiceInput}>
              <Mic size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={inputStyle}
            value={title}
            onChangeText={setTitle}
            placeholder="Ej. Reunión de proyecto"
            placeholderTextColor={colors.subtext}
          />
        </View>

        {/* Descripción */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Descripción</Text>
          <TextInput
            style={[inputStyle, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Detalles adicionales..."
            placeholderTextColor={colors.subtext}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* FECHAS */}
        <View style={styles.datesContainer}>
          
          {/* Inicio */}
          <View style={styles.dateBlock}>
            <Text style={[styles.label, { color: colors.text, fontSize: 14, marginBottom: 6 }]}>
               Iniciar (Fecha/Hora)
            </Text>
            <TouchableOpacity 
              style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
              onPress={() => showPicker('start')}
            >
              <Calendar size={18} color={startDate ? colors.primary : colors.subtext} />
              <Text style={{ color: startDate ? colors.text : colors.subtext, marginLeft: 8, flex: 1 }}>
                {formatDate(startDate)}
              </Text>
              {startDate && (
                <TouchableOpacity onPress={() => setStartDate(undefined)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <XCircle size={18} color={colors.danger} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* Vencimiento */}
          <View style={styles.dateBlock}>
            <Text style={[styles.label, { color: colors.text, fontSize: 14, marginBottom: 6 }]}>
               Vencimiento (Fecha/Hora)
            </Text>
            <TouchableOpacity 
              style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
              onPress={() => showPicker('due')}
            >
              <Clock size={18} color={dueDate ? colors.danger : colors.subtext} />
              <Text style={{ color: dueDate ? colors.text : colors.subtext, marginLeft: 8, flex: 1 }}>
                {formatDate(dueDate)}
              </Text>
              {dueDate && (
                <TouchableOpacity onPress={() => setDueDate(undefined)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <XCircle size={18} color={colors.danger} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* DateTimePicker Component */}
        {activeField && (
          <DateTimePicker
            value={
                activeField === 'start' 
                ? (startDate || new Date()) 
                : (dueDate || new Date())
            }
            mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()} //no permitir fechas pasadas
          />
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Guardando...' : submitButtonText}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fieldContainer: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  datesContainer: { flexDirection: 'column', gap: 15, marginBottom: 25 },
  dateBlock: { flex: 1 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 50,
  }
});