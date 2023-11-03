import React, { memo, useMemo, useState } from "react";

import { SvgIcon, Search, Button } from "components";
import { useQuery } from "hooks";
import { clsx } from "utils";
import { SelectTemplateFileCallback, NoContent } from "docs";
import { templates } from "docs/config/templates.config";
import { Template } from "./template";
import { MIN_HIERARCHY_WIDTH, MAX_HIERARCHY_WIDTH } from "./hierarchy.constants";
import { setInitiallyOpenedRoute, searchTemplates } from "./hierarchy.utils";

import globalStyles from "docs/assets/styles/docs-global.module.css";
import { ReactComponent as LogoSVG } from "docs/assets/images/favicon/logo-grey.svg";
import { ReactComponent as SwapSVG } from "docs/assets/images/swap-arrows-grey.svg";
import styles from "./hierarchy.module.css";

export type HierarchyProps = {
  className?: string;
  onSelectTemplate?: SelectTemplateFileCallback;
  onSwapDirection?: VoidFunction;
};

export const Hierarchy: React.FC<HierarchyProps> = memo(
  ({ className = "", onSelectTemplate, onSwapDirection }: HierarchyProps) => {
    const [search, setSearch] = useState("");

    const { query } = useQuery<{ route: string }>();
    const { route } = query;

    const [hierarchyTemplates] = useState(() => {
      return setInitiallyOpenedRoute(templates, route);
    });

    const canShowControls = !!onSwapDirection;

    const filteredTemplates = useMemo(() => {
      if (!search) return hierarchyTemplates;
      return searchTemplates(hierarchyTemplates, search);
    }, [search, hierarchyTemplates]);

    const hierarchyInlineStyles: React.CSSProperties = {
      minWidth: MIN_HIERARCHY_WIDTH + "px",
      width: 300 + "px",
      maxWidth: MAX_HIERARCHY_WIDTH + "px",
    };

    return (
      <div
        className={clsx(styles.hierarchy, globalStyles.addScrollRounded, className)}
        style={hierarchyInlineStyles}
      >
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <SvgIcon className={styles.logo} icon={LogoSVG} size={48} />
            Core-kit
          </div>
          {canShowControls && (
            <div className={styles.hierarchyControlsWrapper}>
              {onSwapDirection && (
                <Button appearance="whiteGhost" onClick={onSwapDirection}>
                  <SvgIcon icon={SwapSVG} size="small" />
                </Button>
              )}
            </div>
          )}
          <Search placeholder="Find components" searchValue={search} setSearch={setSearch} />
        </div>
        <div className={styles.content}>
          {filteredTemplates.map((template) => (
            <Template
              key={template.name}
              template={template}
              route={route}
              onTemplateFileClick={onSelectTemplate}
            />
          ))}

          {search && !filteredTemplates.length && <NoContent title="Nothing found" />}
        </div>
      </div>
    );
  },
);

export default Hierarchy;
