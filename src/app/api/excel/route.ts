import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

function col(c: number): string {
  let s = ""; c++;
  while (c > 0) { c--; s = String.fromCharCode(65 + (c % 26)) + s; c = Math.floor(c / 26); }
  return s;
}

function buildFlujoCaja(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const inCats = ["Ventas productos","Servicios profesionales","Comisiones","Intereses","Otros ingresos"];
  const exCats = ["Remuneraciones","Arriendo","Servicios básicos","Tecnología","Marketing","Materiales","Transporte","Contabilidad","Seguros","Otros gastos"];
  const data: any[][] = [];
  data.push(["FLUJO DE CAJA — AnalitIA CFO"]);
  data.push(["Empresa:",""]);
  data.push(["Período:","2026"]);
  data.push([]);
  data.push(["CONCEPTO","","", ...months]);
  const saldoRow = data.length;
  data.push(["SALDO INICIAL","","", 0, ...months.slice(1).map(()=>0)]);
  data.push([]);
  data.push(["═══ INGRESOS ═══"]);
  const ingStart = data.length;
  inCats.forEach(c => data.push([c,"","", ...months.map(()=>0)]));
  const ingEnd = data.length - 1;
  const totIngRow = data.length;
  data.push(["TOTAL INGRESOS","","", ...months.map((_,i)=>({f:`SUM(${col(i+3)}${ingStart+1}:${col(i+3)}${ingEnd+1})`}))]);
  data.push([]);
  data.push(["═══ GASTOS ═══"]);
  const gasStart = data.length;
  exCats.forEach(c => data.push([c,"","", ...months.map(()=>0)]));
  const gasEnd = data.length - 1;
  const totGasRow = data.length;
  data.push(["TOTAL GASTOS","","", ...months.map((_,i)=>({f:`SUM(${col(i+3)}${gasStart+1}:${col(i+3)}${gasEnd+1})`}))]);
  data.push([]);
  data.push(["═══ RESUMEN ═══"]);
  const flujoRow = data.length;
  data.push(["FLUJO NETO DEL MES","","", ...months.map((_,i)=>({f:`${col(i+3)}${totIngRow+1}-${col(i+3)}${totGasRow+1}`}))]);
  const acumRow = data.length;
  data.push(["FLUJO ACUMULADO","","", ...months.map((_,i)=>{
    const c2=col(i+3);
    if(i===0) return {f:`${c2}${saldoRow+1}+${c2}${flujoRow+1}`};
    return {f:`${col(i+2)}${acumRow+1}+${c2}${flujoRow+1}`};
  })]);
  data.push(["SALDO FINAL","","", ...months.map((_,i)=>({f:`${col(i+3)}${acumRow+1}`}))]);
  data.push([]);
  data.push(["═══ INDICADORES ═══"]);
  data.push(["Margen (%)","","", ...months.map((_,i)=>{const c2=col(i+3);return{f:`IF(${c2}${totIngRow+1}=0,0,(${c2}${flujoRow+1}/${c2}${totIngRow+1})*100)`};})]);
  data.push(["Ratio Gastos/Ingresos","","", ...months.map((_,i)=>{const c2=col(i+3);return{f:`IF(${c2}${totIngRow+1}=0,0,${c2}${totGasRow+1}/${c2}${totIngRow+1})`};})]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{wch:28},{wch:10},{wch:4},...months.map(()=>({wch:14}))];
  XLSX.utils.book_append_sheet(wb, ws, "Flujo de Caja");

  // Registro diario
  const regH = ["Fecha","Tipo","Categoría","Subcategoría","Descripción","Monto","Método Pago","N° Doc","Obs"];
  const regSample = [
    ["2026-01-05","ingreso","Ventas productos","","Factura #001",1500000,"Transferencia","F-001",""],
    ["2026-01-05","gasto","Remuneraciones","Sueldo base","Pago enero",2800000,"Transferencia","LIQ-001",""],
    ["2026-01-10","ingreso","Servicios profesionales","","Consultoría ABC",800000,"Transferencia","F-002",""],
  ];
  const regData: any[][] = [["REGISTRO DIARIO"],[],[], regH, ...regSample, ...Array(50).fill(["","","","","",0,"","",""])];
  const rLast = regData.length;
  regData.push([]);
  regData.push(["RESUMEN","","","","",""]);
  regData.push(["Total Ingresos:","","","","",{f:`SUMIFS(F5:F${rLast},B5:B${rLast},"ingreso")`}]);
  regData.push(["Total Gastos:","","","","",{f:`SUMIFS(F5:F${rLast},B5:B${rLast},"gasto")`}]);
  regData.push(["Flujo Neto:","","","","",{f:`F${rLast+3}-F${rLast+4}`}]);
  const regWs = XLSX.utils.aoa_to_sheet(regData);
  regWs["!cols"]=[{wch:12},{wch:10},{wch:24},{wch:18},{wch:35},{wch:15},{wch:16},{wch:14},{wch:25}];
  XLSX.utils.book_append_sheet(wb, regWs, "Registro Diario");

  const catData=[["CATEGORÍAS"],[""],["INGRESOS","GASTOS"],...Array(Math.max(inCats.length,exCats.length)).fill(null).map((_,i)=>[inCats[i]||"",exCats[i]||""])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(catData), "Categorías");
  return wb;
}

function buildContabilidad(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const plan: any[][]=[
    ["PLAN DE CUENTAS — AnalitIA CFO"],[""],[],
    ["Código","Nombre Cuenta","Tipo","Saldo Debe","Saldo Haber"],
    ["1.1.01","Caja","Activo",0,0],["1.1.02","Banco Estado CTA CTE","Activo",0,0],
    ["1.1.03","Banco Chile CTA CTE","Activo",0,0],["1.2.01","Cuentas por Cobrar","Activo",0,0],
    ["1.3.01","IVA Crédito Fiscal","Activo",0,0],["1.4.01","Inventario","Activo",0,0],
    ["1.5.01","Maquinaria y Equipos","Activo",0,0],["1.5.02","Depreciación Acumulada","Activo",0,0],
    [],["2.1.01","Cuentas por Pagar","Pasivo",0,0],["2.1.02","Remuneraciones por Pagar","Pasivo",0,0],
    ["2.1.03","IVA Débito Fiscal","Pasivo",0,0],["2.2.01","Préstamos Bancarios LP","Pasivo",0,0],
    [],["3.1.01","Capital Social","Patrimonio",0,0],["3.1.02","Utilidades Retenidas","Patrimonio",0,0],
    ["3.1.03","Resultado del Ejercicio","Patrimonio",0,0],
    [],["4.1.01","Ingresos por Ventas","Ingreso",0,0],["4.1.02","Ingresos por Servicios","Ingreso",0,0],
    [],["5.1.01","Gasto Remuneraciones","Gasto",0,0],["5.1.02","Gasto Arriendo","Gasto",0,0],
    ["5.1.03","Gasto Servicios Básicos","Gasto",0,0],["5.1.04","Gasto Tecnología","Gasto",0,0],
    ["5.1.05","Gasto Marketing","Gasto",0,0],["5.1.06","Otros Gastos","Gasto",0,0],
  ];
  const lr=plan.length;
  plan.push([]);
  plan.push(["","TOTAL DEBE","",{f:`SUM(D5:D${lr})`},""]);
  plan.push(["","TOTAL HABER","","",{f:`SUM(E5:E${lr})`}]);
  plan.push(["","CUADRATURA","",{f:`D${lr+2}-E${lr+3}`},""]);
  const ws=XLSX.utils.aoa_to_sheet(plan);
  ws["!cols"]=[{wch:12},{wch:30},{wch:14},{wch:18},{wch:18}];
  XLSX.utils.book_append_sheet(wb,ws,"Plan de Cuentas");

  // EERR
  const eerr: any[][]=[
    ["ESTADO DE RESULTADOS"],[""],[],["CONCEPTO","","MONTO"],[],
    ["INGRESOS OPERACIONALES"],["  Ingresos por Ventas","",0],["  Ingresos por Servicios","",0],["  Otros Ingresos","",0],
    ["TOTAL INGRESOS","",{f:"SUM(C7:C9)"}],[],
    ["COSTOS"],["  Costo de Ventas","",0],["TOTAL COSTOS","",{f:"C13"}],[],
    ["MARGEN BRUTO","",{f:"C10-C14"}],["Margen Bruto (%)","",{f:"IF(C10=0,0,C16/C10*100)"}],[],
    ["GASTOS ADMIN"],["  Remuneraciones","",0],["  Arriendo","",0],["  Servicios Básicos","",0],
    ["  Tecnología","",0],["  Marketing","",0],["  Otros","",0],
    ["TOTAL GASTOS","",{f:"SUM(C20:C25)"}],[],
    ["EBITDA","",{f:"C16-C26"}],["Margen EBITDA (%)","",{f:"IF(C10=0,0,C28/C10*100)"}],[],
    ["  Intereses","",0],["  Impuestos (27%)","",{f:"IF(C28>0,C28*0.27,0)"}],[],
    ["RESULTADO NETO","",{f:"C28-C31-C32"}],["Margen Neto (%)","",{f:"IF(C10=0,0,C34/C10*100)"}],
  ];
  const eerrWs=XLSX.utils.aoa_to_sheet(eerr);
  eerrWs["!cols"]=[{wch:30},{wch:4},{wch:18}];
  XLSX.utils.book_append_sheet(wb,eerrWs,"Estado Resultados");

  // Balance
  const bg: any[][]=[
    ["BALANCE GENERAL"],[""],[],["","","MONTO"],[],
    ["ACTIVOS CORRIENTES"],["  Caja","",0],["  Bancos","",0],["  Cuentas por Cobrar","",0],
    ["  Inventario","",0],["  IVA Crédito","",0],
    ["TOTAL ACT. CORRIENTES","",{f:"SUM(C7:C11)"}],[],
    ["ACTIVOS NO CORRIENTES"],["  Maquinaria","",0],["  (-) Depreciación","",0],
    ["TOTAL ACT. NO CORRIENTES","",{f:"C15-C16"}],[],
    ["TOTAL ACTIVOS","",{f:"C12+C17"}],[],
    ["PASIVOS CORRIENTES"],["  Cuentas por Pagar","",0],["  Remuneraciones","",0],["  IVA Débito","",0],
    ["TOTAL PAS. CORRIENTES","",{f:"SUM(C22:C24)"}],[],
    ["PASIVOS NO CORRIENTES"],["  Préstamos LP","",0],
    ["TOTAL PAS. NO CORRIENTES","",{f:"C28"}],[],
    ["TOTAL PASIVOS","",{f:"C25+C29"}],[],
    ["PATRIMONIO"],["  Capital Social","",0],["  Utilidades Retenidas","",0],["  Resultado Ejercicio","",0],
    ["TOTAL PATRIMONIO","",{f:"SUM(C34:C36)"}],[],
    ["TOTAL P+P","",{f:"C31+C37"}],[],
    ["CUADRATURA (=0)","",{f:"C19-C39"}],[],
    ["═══ RATIOS ═══"],
    ["Liquidez Corriente","",{f:'IF(C25=0,"N/A",C12/C25)'}],
    ["Endeudamiento","",{f:'IF(C19=0,"N/A",C31/C19)'}],
    ["ROE (%)","",{f:'IF(C37=0,"N/A",C36/C37*100)'}],
    ["ROA (%)","",{f:'IF(C19=0,"N/A",C36/C19*100)'}],
  ];
  const bgWs=XLSX.utils.aoa_to_sheet(bg);
  bgWs["!cols"]=[{wch:30},{wch:4},{wch:18}];
  XLSX.utils.book_append_sheet(wb,bgWs,"Balance General");
  return wb;
}

function buildPresupuestos(): XLSX.WorkBook {
  const wb=XLSX.utils.book_new();
  const d: any[][]=[
    ["PRESUPUESTO — AnalitIA CFO"],[],
    ["EMPRESA"],["Razón Social:",""],["RUT:",""],["Dirección:",""],["Email:",""],["Teléfono:",""],
    [],["CLIENTE"],["Razón Social:",""],["RUT:",""],["Contacto:",""],["Email:",""],
    [],["N° Presupuesto:","P-001"],["Fecha:","2026-04-12"],["Validez:","30 días"],
    [],["N°","Descripción","Cantidad","P. Unitario","Subtotal"],
    ...[1,2,3,4,5,6,7,8,9,10].map(n=>[n,"",0,0,{f:`C${n+20}*D${n+20}`}]),
    [],["","","","SUBTOTAL",{f:"SUM(E21:E30)"}],
    ["","","","IVA (19%)",{f:"E32*0.19"}],
    ["","","","TOTAL",{f:"E32+E33"}],
    [],["Forma de pago:",""],["Plazo entrega:",""],["Garantía:",""],["Observaciones:",""],
  ];
  const ws=XLSX.utils.aoa_to_sheet(d);
  ws["!cols"]=[{wch:6},{wch:40},{wch:12},{wch:16},{wch:16}];
  XLSX.utils.book_append_sheet(wb,ws,"Presupuesto");
  return wb;
}

function buildCreditos(): XLSX.WorkBook {
  const wb=XLSX.utils.book_new();
  const d: any[][]=[
    ["EVALUACIÓN CREDITICIA — AnalitIA CFO"],[],
    ["SOLICITANTE"],["Razón Social:",""],["RUT:",""],["Antigüedad (años):",0],["N° Empleados:",0],
    [],["DATOS FINANCIEROS"],["Ventas Anuales:",0],["Utilidad Neta:",0],["Activos Totales:",0],["Pasivos Totales:",0],["Patrimonio:",{f:"B12-B13"}],
    [],["Monto Solicitado:",0],["Plazo (meses):",12],["Tasa Mensual:",0.015],
    [],["═══ SCORING ═══"],[],
    ["CRITERIO","VALOR","PUNTAJE","PESO","PONDERADO"],
    ["Endeudamiento",{f:'IF(B12=0,"N/A",B13/B12)'},{f:'IF(C22="N/A",0,IF(C22<0.4,25,IF(C22<0.6,15,IF(C22<0.8,8,0))))'},0.25,{f:"D22*E22"}],
    ["Margen Utilidad",{f:'IF(B10=0,"N/A",B11/B10)'},{f:'IF(C23="N/A",0,IF(C23>0.15,25,IF(C23>0.08,15,IF(C23>0.03,8,0))))'},0.25,{f:"D23*E23"}],
    ["Cobertura Deuda",{f:'IF(B16=0,"N/A",B11/(B16/B17))'},{f:'IF(C24="N/A",0,IF(C24>3,25,IF(C24>1.5,15,IF(C24>1,8,0))))'},0.20,{f:"D24*E24"}],
    ["Antigüedad",{f:"B6"},{f:'IF(C25>5,25,IF(C25>3,15,IF(C25>1,8,0)))'},0.15,{f:"D25*E25"}],
    ["Tamaño",{f:"B7"},{f:'IF(C26>50,25,IF(C26>10,15,IF(C26>3,8,0)))'},0.15,{f:"D26*E26"}],
    [],["SCORE TOTAL","","","",{f:"SUM(F22:F26)"}],[],
    ["DECISIÓN:",{f:'IF(F28>=18,"APROBADO",IF(F28>=12,"REVISIÓN","RECHAZADO"))'}],
    ["RIESGO:",{f:'IF(F28>=18,"BAJO",IF(F28>=12,"MEDIO","ALTO"))'}],[],
    ["Cuota Mensual:",{f:'IF(B16=0,0,B16*(B18*(1+B18)^B17)/((1+B18)^B17-1))'}],
    ["Total a Pagar:",{f:"B33*B17"}],
    ["Intereses:",{f:"B34-B16"}],
  ];
  const ws=XLSX.utils.aoa_to_sheet(d);
  ws["!cols"]=[{wch:22},{wch:16},{wch:12},{wch:10},{wch:14}];
  XLSX.utils.book_append_sheet(wb,ws,"Evaluación");
  return wb;
}

function buildSaaS(): XLSX.WorkBook {
  const wb=XLSX.utils.book_new();
  const m=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const d: any[][]=[
    ["MÉTRICAS SaaS — AnalitIA CFO"],[],
    ["MÉTRICA",...m],
    ["Clientes Inicio",...m.map(()=>0)],
    ["Nuevos Clientes",...m.map(()=>0)],
    ["Clientes Churn",...m.map(()=>0)],
    ["Clientes Fin",...m.map((_,i)=>({f:`${col(i+1)}4+${col(i+1)}5-${col(i+1)}6`}))],
    [],
    ["MRR Inicio",...m.map(()=>0)],
    ["New MRR",...m.map(()=>0)],
    ["Expansion MRR",...m.map(()=>0)],
    ["Churned MRR",...m.map(()=>0)],
    ["MRR Fin",...m.map((_,i)=>({f:`${col(i+1)}9+${col(i+1)}10+${col(i+1)}11-${col(i+1)}12`}))],
    [],["═══ KPIs ═══"],
    ["ARR",...m.map((_,i)=>({f:`${col(i+1)}13*12`}))],
    ["ARPU",...m.map((_,i)=>({f:`IF(${col(i+1)}7=0,0,${col(i+1)}13/${col(i+1)}7)`}))],
    ["Churn (%)",...m.map((_,i)=>({f:`IF(${col(i+1)}4=0,0,${col(i+1)}6/${col(i+1)}4*100)`}))],
    [],["CAC",...m.map(()=>0)],
    ["LTV",...m.map((_,i)=>({f:`IF(${col(i+1)}18=0,0,${col(i+1)}17/(${col(i+1)}18/100))`}))],
    ["LTV/CAC",...m.map((_,i)=>({f:`IF(${col(i+1)}20=0,0,${col(i+1)}21/${col(i+1)}20)`}))],
  ];
  const ws=XLSX.utils.aoa_to_sheet(d);
  ws["!cols"]=[{wch:20},...m.map(()=>({wch:13}))];
  XLSX.utils.book_append_sheet(wb,ws,"SaaS Metrics");
  return wb;
}

function buildOrdenes(): XLSX.WorkBook {
  const wb=XLSX.utils.book_new();
  const d: any[][]=[
    ["ORDEN DE COMPRA — AnalitIA CFO"],[],
    ["N° OC:","OC-2026-001"],["Fecha:","2026-04-12"],["Proveedor:",""],["RUT:",""],["Condición:","30 días"],
    [],["N°","Código","Descripción","Unidad","Cantidad","P. Unit.","Total"],
    ...[1,2,3,4,5,6,7,8,9,10].map(n=>[n,"","","UN",0,0,{f:`E${n+9}*F${n+9}`}]),
    [],["","","","","","SUBTOTAL",{f:"SUM(G10:G19)"}],
    ["","","","","","IVA (19%)",{f:"G21*0.19"}],
    ["","","","","","TOTAL",{f:"G21+G22"}],
    [],["Autorizado:","","","","Recibido:"],
  ];
  const ws=XLSX.utils.aoa_to_sheet(d);
  ws["!cols"]=[{wch:6},{wch:14},{wch:35},{wch:8},{wch:10},{wch:14},{wch:14}];
  XLSX.utils.book_append_sheet(wb,ws,"Orden de Compra");
  return wb;
}

const BUILDERS: Record<string,()=>XLSX.WorkBook>={
  "flujo-caja":buildFlujoCaja, contabilidad:buildContabilidad,
  presupuestos:buildPresupuestos, creditos:buildCreditos,
  saas:buildSaaS, ordenes:buildOrdenes,
};

export async function GET(req: NextRequest) {
  const t=new URL(req.url).searchParams.get("template")||"flujo-caja";
  const b=BUILDERS[t];
  if(!b) return NextResponse.json({error:`Template "${t}" no encontrado`},{status:404});
  const buf=XLSX.write(b(),{type:"buffer",bookType:"xlsx"});
  return new NextResponse(buf,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="analitia-cfo-${t}.xlsx"`}});
}

export async function POST(req: NextRequest) {
  try {
    const fd=await req.formData();
    const file=fd.get("file") as File;
    const template=fd.get("template") as string||"flujo-caja";
    if(!file) return NextResponse.json({error:"No file"},{status:400});
    const buf=Buffer.from(await file.arrayBuffer());
    const wb=XLSX.read(buf,{type:"buffer"});
    const sn=wb.SheetNames.find(s=>!["Instrucciones","Categorías"].includes(s))||wb.SheetNames[0];
    const rows=XLSX.utils.sheet_to_json<Record<string,any>>(wb.Sheets[sn],{range:3});
    const entries:any[]=[], errors:string[]=[];
    for(let i=0;i<rows.length;i++){
      const r=rows[i], rn=i+5;
      try{
        const tipo=String(r["Tipo"]||"").toLowerCase().trim();
        if(!tipo) continue;
        const et=tipo==="ingreso"?"income":tipo==="gasto"?"expense":tipo;
        if(!["income","expense","asset","liability"].includes(et)){errors.push(`Fila ${rn}: Tipo inválido`);continue;}
        const amt=Number(r["Monto"]||r["Subtotal"]||0);
        if(amt===0) continue;
        entries.push({entry_type:et,category:String(r["Categoría"]||r["Cuenta"]||"Otros"),description:String(r["Descripción"]||r["Glosa"]||""),amount:amt,date:fmtDate(r["Fecha"]),product_slug:template==="contabilidad"?"control-total":"flujo-caja-premium",currency:"CLP",metadata:{}});
      }catch{errors.push(`Fila ${rn}: Error`);}
    }
    return NextResponse.json({success:true,parsed:entries.length,errors:errors.length?errors:undefined,entries});
  }catch{return NextResponse.json({error:"Error procesando"},{status:500});}
}

function fmtDate(v:any):string{
  if(!v) return new Date().toISOString().split("T")[0];
  if(typeof v==="number") return new Date((v-25569)*86400000).toISOString().split("T")[0];
  const s=String(v).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d=new Date(s);
  return isNaN(d.getTime())?new Date().toISOString().split("T")[0]:d.toISOString().split("T")[0];
}
