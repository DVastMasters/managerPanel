<?php
    if (is_readable("todaySchedule.txt"))
    {
        $items = array();
        $file = fopen("todaySchedule.txt", "r") 
                or exit("Error: Cannot open file 'todaySchedule.txt'");

        $item = "";                    
        while (false !== ($char = fgetc($file)))
        {
            if ($char == "\n")
            {
                array_push($items, $item);
                
                $item = "";
            }
            else 
            {
                $item = $item . $char;   
            }           
        }

        echo json_encode($items);   
        
    }
?>