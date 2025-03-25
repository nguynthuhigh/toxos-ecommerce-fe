import LOCATION from "@/data/location.json";
export interface Province {
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  District: District[];
}

export interface District {
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  ProvinceCode: string;
  Ward?: Ward[] | null;
}

export interface Ward {
  Code: string;
  Name: string;
  NameEn: string;
  FullName: string;
  FullNameEn: string;
  CodeName: string;
  DistrictCode: string;
}

export const provinces: Province[] = LOCATION;

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchProvinces(query: string): Province[] {
  const searchTerm = removeVietnameseTones(query.trim());
  if (!searchTerm) return provinces;

  return provinces.filter((province) => {
    const provinceNames = [
      removeVietnameseTones(province.Name),
      removeVietnameseTones(province.FullName),
    ];
    for (const district of province.District) {
      const districtNames = [
        removeVietnameseTones(district.Name),
        removeVietnameseTones(district.FullName),
      ];

      if (
        districtNames.some((name) => name.includes(searchTerm)) ||
        district.Ward?.some((ward) =>
          [
            removeVietnameseTones(ward.Name),
            removeVietnameseTones(ward.FullName),
          ].some((name) => name.includes(searchTerm))
        )
      ) {
        return true;
      }
    }
    return provinceNames.some((name) => name.includes(searchTerm));
  });
}
