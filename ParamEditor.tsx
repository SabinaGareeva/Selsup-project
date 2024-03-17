// Тестовое задание для компании "SelSup"
// Выполнено на функциональных компонентах React 
// Есть возможность добавления,редактирования и удаления параметра, а также редактирование значений параметров в input, и их показ при кнопке Get Model 

import React, { ReactNode, useState } from "react";
import { ChangeEvent } from "react";

// Интерфейс параметра товара
interface Param {
  id: number;
  name: string;
  type: string;
}

// Интерфейс значения параметра товара
interface ParamValue {
  paramId: number;
  value: string;
}

// Интерфейс модели товара
interface Model {
  paramValues: ParamValue[];
}

// Интерфейс свойств компонента ParamEditor
interface Props {
  params: Param[]; // Параметры товара
  model: Model; // Модель товара
}

interface ParamInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}


// input основной
const DefaultInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}> = ({ value, onChange, placeholder, style }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
    />
  );
};

// input для изменения параметра
const ParamInput: React.FC<ParamInputProps> = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus // Фокусируем input автоматически
      style={{ width: "12rem" }}
    />
  );
};
// label параметра
const ParamLabel: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => {
  return (
    <label
      onClick={onClick}
      style={{ minWidth: "12rem", display: "inline-block" }}
    >
      {label}
    </label>
  );
};
const Button: React.FC<{ onClick: () => void; children: ReactNode }> = ({
  onClick,
  children,
}) => {
  return <button onClick={onClick}>{children}</button>;
};

// Компонент ParamEditor
const ParamEditor: React.FC<Props> = ({
  params: initialParams,
  model: initialModel,
}) => {
  const [params, setParams] = useState<Param[]>(initialParams); // Состояние для отображения параметров модели
  const [model, setModel] = useState<Model>(initialModel); // Состояние для отображения значений параметров модели
  const [newParamName, setNewParamName] = useState<string>(""); // Состояние для добавления параметров
  const [showModel, setShowModel] = useState<boolean>(false); // Состояние для отображения модели
  const [editParamId, setEditParamId] = useState<number | null>(null); // Идентификатор параметра в режиме редактирования

  const handleParamChange = (paramId: number, value: string) => {
    const updatedParamValues: ParamValue[] = model.paramValues.map(
      (paramValue) =>
        paramValue.paramId === paramId ? { ...paramValue, value } : paramValue
    );

    const updatedModel: Model = {
      ...model,
      paramValues: updatedParamValues,
    };

    setModel(updatedModel);
  };

  const addParam = () => {
    if (!newParamName.trim()) return; // Если имя параметра пустое, не добавляем параметр

    const newParamId = params.length + 1;
    const newParam: Param = {
      id: newParamId,
      name: newParamName.trim(), // Используем имя, введенное пользователем
      type: "string",
    };

    setParams([...params, newParam]);

    const defaultValue = "";
    const newParamValue: ParamValue = {
      paramId: newParamId,
      value: defaultValue,
    };

    setModel({
      ...model,
      paramValues: [...model.paramValues, newParamValue],
    });

    setNewParamName(""); // Очищаем значение input после добавления параметра
  };

  const removeParam = (paramId: number) => {
    // Фильтруем параметры и значения, оставляя только те, у которых id не совпадает с paramId
    const filteredParams = params.filter((param) => param.id !== paramId);
    const filteredParamValues = model.paramValues.filter(
      (paramValue) => paramValue.paramId !== paramId
    );

    // Обновляем состояния
    setParams(filteredParams);
    setModel({ ...model, paramValues: filteredParamValues });
  };

  const editParamName = (paramId: number) => {
    // Устанавливаем идентификатор параметра в режим редактирования
    setEditParamId(paramId);
  };

  const saveParamName = (paramId: number, newName: string) => {
    // Находим параметр в списке и обновляем его имя
    const updatedParams = params.map((param) =>
      param.id === paramId ? { ...param, name: newName } : param
    );
    setParams(updatedParams);
  };

  const cancelEditParamName = () => {
    // Сбрасываем режим редактирования
    setEditParamId(null);
  };

  return (
    <div>
      <h2>Редактор параметров</h2>
      <div style={{ marginBottom: "1rem" }}>
        {params.map((param) => (
          <div key={param.id}>
            {editParamId === param.id ? (
              // Если параметр находится в режиме редактирования, отображаем input для редактирования названия
              <ParamInput
                value={param.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  saveParamName(param.id, e.target.value);
                }}
                onBlur={() => setEditParamId(null)} // Сброс режима редактирования при потере фокуса
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    cancelEditParamName();
                  }
                }}
              />
            ) : (
              // В противном случае отображаем текст названия параметра
              <ParamLabel
                onClick={() => editParamName(param.id)}
                label={param.name}
              />
            )}
            <DefaultInput
              value={
                model.paramValues.find((pv) => pv.paramId === param.id)
                  ?.value || ""
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleParamChange(param.id, e.target.value)
              }
            />
            {/* Кнопка для удаления параметра */}
            <Button onClick={() => removeParam(param.id)}>❌</Button>
          </div>
        ))}
      </div>
      <div>
        <DefaultInput
          style={{ margin: "0 1rem 1rem 0" }}
          value={newParamName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewParamName(e.target.value)
          }
          placeholder="Enter new param name"
        />
        <Button onClick={addParam}>Get Model</Button>
      </div>
      {/* Кнопка для отображения модели */}
      <Button onClick={() => setShowModel(true)}>Get Model</Button>
      {/* Если showModel равно true, отображаем значения параметров */}
      {showModel && (
        <div>
          <h2>Model</h2>
          {model.paramValues.map((paramValue) => (
            <div key={paramValue.paramId}>
              <p>{paramValue.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParamEditor;
