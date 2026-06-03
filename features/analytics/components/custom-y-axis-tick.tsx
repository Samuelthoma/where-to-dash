export const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-140" y="-14" width="130" height="40">
        <div
          className="flex items-center justify-end w-full h-full pr-2"
        >
          <span className="text-[11px] font-medium text-slate-700 text-right leading-tight line-clamp-2">
            {payload.value}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};
