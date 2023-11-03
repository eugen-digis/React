import React from "react";

import { Button, Input, SvgIcon } from "components";
import { memo, getSVGStatus, clsx } from "utils";
import { SearchProps } from "./search.types";

import { ReactComponent as SearchImg } from "assets/images/search-icon-grey.svg";
import { ReactComponent as ClearImg } from "assets/images/cross-grey.svg";
import styles from "./search.module.css";

export const Search: React.FC<SearchProps> = memo(
  ({
    searchValue,
    setSearch,
    appearance = "primary",
    className = "",
    inputWrapperClassName = "",
    placeholder = "Search",
    ...props
  }: SearchProps) => {
    const handleClear = () => setSearch("");

    return (
      <Input
        {...props}
        appearance={appearance}
        className={clsx(styles.container, className)}
        inputWrapperClassName={clsx(styles.inputWrapper, inputWrapperClassName)}
        placeholder={placeholder}
        value={searchValue}
        onChange={setSearch}
        disableError
      >
        <SvgIcon
          className={clsx(styles.searchIcon, getSVGStatus("textTertiary"))}
          icon={SearchImg}
        />
        {searchValue && (
          <Button className={styles.clearIcon} appearance="secondaryGhost" onClick={handleClear}>
            <SvgIcon className={getSVGStatus("textTertiary")} icon={ClearImg} />
          </Button>
        )}
      </Input>
    );
  },
);

export default Search;
